# app.py
import os
import subprocess
import uuid
import json
import shutil
import time
from datetime import datetime
from flask import Flask, request, render_template, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import pytz

# Set UTF-8 encoding for the entire application
import sys
if sys.platform == 'win32':
    import locale
    import os
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    try:
        locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    except locale.Error:
        try:
            locale.setlocale(locale.LC_ALL, 'C.UTF-8')
        except locale.Error:
            pass

load_dotenv()

UPLOAD_FOLDER = Path("uploads")
OUTPUT_FOLDER = Path("outputs")
SAMPLES_FOLDER = Path("samples")  # optional: place pre-made sample images here
ALLOWED_EXT = {"png","jpg","jpeg","webp"}

API_KEY = os.environ.get("GEMINI_API_KEY")  # put your API key in .env or env var
MODEL_NAME = os.environ.get("GEMINI_MODEL","gemini-2.5-flash-image")
CLEANUP_AGE_HOURS = int(os.environ.get("CLEANUP_AGE_HOURS", "24"))  # Default 24 hours

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20 MB limit per upload

UPLOAD_FOLDER.mkdir(exist_ok=True)
OUTPUT_FOLDER.mkdir(exist_ok=True)
SAMPLES_FOLDER.mkdir(exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT


def cleanup_old_files():
    """Delete files and folders older than CLEANUP_AGE_HOURS in uploads and outputs directories"""
    try:
        current_time = time.time()
        age_threshold = CLEANUP_AGE_HOURS * 3600  # Convert hours to seconds
        deleted_files = 0
        deleted_folders = 0
        freed_space = 0

        print(f"[CLEANUP] Starting cleanup at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (VN Time)", flush=True)
        print(f"[CLEANUP] Deleting files/folders older than {CLEANUP_AGE_HOURS} hours", flush=True)

        # Clean uploads folder
        if UPLOAD_FOLDER.exists():
            for item in UPLOAD_FOLDER.iterdir():
                try:
                    item_age = current_time - item.stat().st_mtime
                    if item_age > age_threshold:
                        if item.is_file():
                            size = item.stat().st_size
                            item.unlink()
                            deleted_files += 1
                            freed_space += size
                            print(f"[CLEANUP] Deleted file: {item.name} ({size / 1024:.2f} KB)", flush=True)
                        elif item.is_dir():
                            size = sum(f.stat().st_size for f in item.rglob('*') if f.is_file())
                            shutil.rmtree(item)
                            deleted_folders += 1
                            freed_space += size
                            print(f"[CLEANUP] Deleted folder: {item.name} ({size / 1024:.2f} KB)", flush=True)
                except Exception as e:
                    print(f"[CLEANUP] Error deleting {item}: {e}", flush=True)

        # Clean outputs folder
        if OUTPUT_FOLDER.exists():
            for item in OUTPUT_FOLDER.iterdir():
                try:
                    item_age = current_time - item.stat().st_mtime
                    if item_age > age_threshold:
                        if item.is_dir():
                            size = sum(f.stat().st_size for f in item.rglob('*') if f.is_file())
                            shutil.rmtree(item)
                            deleted_folders += 1
                            freed_space += size
                            print(f"[CLEANUP] Deleted output folder: {item.name} ({size / 1024:.2f} KB)", flush=True)
                        elif item.is_file():
                            size = item.stat().st_size
                            item.unlink()
                            deleted_files += 1
                            freed_space += size
                            print(f"[CLEANUP] Deleted output file: {item.name} ({size / 1024:.2f} KB)", flush=True)
                except Exception as e:
                    print(f"[CLEANUP] Error deleting {item}: {e}", flush=True)

        print(f"[CLEANUP] Completed: {deleted_files} files, {deleted_folders} folders deleted", flush=True)
        print(f"[CLEANUP] Total space freed: {freed_space / 1024 / 1024:.2f} MB", flush=True)

    except Exception as e:
        print(f"[CLEANUP] Error during cleanup: {e}", flush=True)


def load_banknote_styles():
    """Load banknote styles from JSON configuration file"""
    try:
        with open('banknote_styles.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading banknote styles: {e}")
        return {"banknotes": []}


def run_generate_command(prompt, image_paths, output_dir):
    """Helper to run generate.py with subprocess"""
    cmd = [
        'python', 'generate.py',
        '--images', *image_paths,
        '--prompt', prompt,
        '--outdir', output_dir,
        '--api-key', API_KEY,
        '--model', MODEL_NAME
    ]

    try:
        # Set environment to handle UTF-8 encoding
        env = os.environ.copy()
        env['PYTHONIOENCODING'] = 'utf-8'
        completed = subprocess.run(cmd, capture_output=True, text=True, timeout=300, env=env)
        return completed
    except subprocess.TimeoutExpired:
        class ProcessResult:
            def __init__(self):
                self.returncode = 1
                self.stdout = ""
                self.stderr = "Generation timed out"
        return ProcessResult()


def optimize_image_for_gemini(image_path, max_dimension=1024):
    """
    Optimize image for Gemini Flash processing by downscaling if too large.
    Only resizes if width or height exceeds max_dimension (default 1024px).
    Preserves aspect ratio using thumbnail() to avoid distortion.
    
    Based on Gemini Flash documentation:
    - Images ≤1024×1024: optimal quality and processing speed
    - Images >1024×1024: automatically tiled (slower, more tokens)
    
    Args:
        image_path: Path to image file to optimize
        max_dimension: Maximum width/height in pixels (default 1024)
    
    Returns:
        True if successful, False if error occurred
    """
    try:
        with Image.open(image_path) as img:
            original_size = img.size
            
            # Convert RGBA to RGB if needed
            if img.mode == 'RGBA':
                img = img.convert('RGB')

            # Only resize if image exceeds max_dimension
            if img.width > max_dimension or img.height > max_dimension:
                # Use thumbnail to preserve aspect ratio
                img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
                print(f"Image optimized: {original_size[0]}x{original_size[1]} → {img.size[0]}x{img.size[1]}", flush=True)
            else:
                print(f"Image already optimal: {original_size[0]}x{original_size[1]} (no resize needed)", flush=True)

            img.save(image_path, quality=95)
            return True
    except Exception as e:
        print(f"Error optimizing image {image_path}: {e}", flush=True)
        return False


@app.route('/')
def index():
    # load banknote styles from JSON
    banknote_styles = load_banknote_styles()
    return render_template('index.html', banknotes=banknote_styles['banknotes'])


@app.route('/run', methods=['POST'])
def run_generation():
    # input_image: required
    # banknote_choice: required (select which banknote style to use)
    if 'input_image' not in request.files:
        return jsonify({"error": "input_image field is required"}), 400

    input_file = request.files['input_image']
    if input_file.filename == '' or not allowed_file(input_file.filename):
        return jsonify({"error": "Invalid input image"}), 400

    # Get banknote choice
    banknote_choice = request.form.get('banknote_choice')
    if not banknote_choice:
        return jsonify({"error": "banknote_choice field is required"}), 400

    # Load banknote styles and find the selected one
    banknote_styles = load_banknote_styles()
    selected_banknote = None
    for banknote in banknote_styles['banknotes']:
        if banknote['id'] == banknote_choice:
            selected_banknote = banknote
            break

    if not selected_banknote:
        return jsonify({"error": f"Banknote choice '{banknote_choice}' not found"}), 400

    # Get banknote sample image path
    sample_path = SAMPLES_FOLDER / selected_banknote['sample_image']
    if not sample_path.exists():
        return jsonify({"error": f"Sample image {selected_banknote['sample_image']} not found"}), 400

    # Save input image
    input_fname = secure_filename(input_file.filename)
    input_id = f"{uuid.uuid4().hex}_{input_fname}"
    input_path = UPLOAD_FOLDER / input_id
    input_file.save(input_path)

    # Optimize input image for Gemini Flash processing
    optimize_image_for_gemini(input_path)

    # Prepare unique output folder for this run with step1 and step2 subfolders
    run_id = uuid.uuid4().hex
    this_outdir = OUTPUT_FOLDER / run_id
    step1_dir = this_outdir / "step1"
    step2_dir = this_outdir / "step2"
    step1_dir.mkdir(parents=True, exist_ok=True)
    step2_dir.mkdir(parents=True, exist_ok=True)

    if not API_KEY:
        return jsonify({"error": "Server missing GEMINI_API_KEY environment variable"}), 500

    try:
        # Step 1: Apply banknote style to input image
        style_prompt = f"{selected_banknote['style_description']}. Edit the image to precisely match this banknote style, maintaining high detail, engraving techniques, and all artistic elements without adding extra frames or borders."

        print(f"Step 1: Applying style {selected_banknote['name']} to input image", flush=True)

        # Validate input image before proceeding
        if not os.path.exists(input_path):
            return jsonify({"error": f"Input image file not found: {input_path}"}), 500

        # Pass the input image to step 1
        step1_images = [str(input_path)]

        step1_result = run_generate_command(
            style_prompt,
            step1_images,
            str(step1_dir)
        )

        if step1_result.returncode != 0:
            return jsonify({
                "error": "Step 1 (style application) failed",
                "stdout": step1_result.stdout,
                "stderr": step1_result.stderr,
                "returncode": step1_result.returncode
            }), 500

        # Check if step 1 generated the styled image
        styled_image_path = step1_dir / "styled_image.png"
        if not styled_image_path.exists():
            return jsonify({"error": "Step 1 did not generate styled image"}), 500

        print(f"Step 1 completed successfully, styled image saved to {styled_image_path}")

        # Step 2: Integrate styled image into banknote
        integration_prompt = """Remove the central content inside the banknote. Then insert the first image as the main central content in the banknote. Keep both images orientations intact. Ensure the first image is at the center of the banknote and neatly enclosed between the banknote frames. make it look boundlessly integrated to the banknote."""

        print(f"Step 2: Integrating styled image into {selected_banknote['name']}")
        step2_result = run_generate_command(
            integration_prompt,
            [str(styled_image_path), str(sample_path)],
            str(step2_dir)
        )

        if step2_result.returncode != 0:
            return jsonify({
                "error": "Step 2 (banknote integration) failed",
                "stdout": step2_result.stdout,
                "stderr": step2_result.stderr,
                "returncode": step2_result.returncode
            }), 500

        print(f"Step 2 completed successfully")

        # Collect results
        result = {
            'returncode': 0,
            'stdout': f"Step 1: {step1_result.stdout}\nStep 2: {step2_result.stdout}",
            'stderr': f"Step 1: {step1_result.stderr}\nStep 2: {step2_result.stderr}",
            'outputs': [],
            'step_outputs': {
                'step1': [],
                'step2': []
            }
        }

        # List step1 outputs
        for p in sorted(step1_dir.iterdir()):
            if p.is_file() and allowed_file(p.name):
                result['step_outputs']['step1'].append(f"/outputs/{run_id}/step1/{p.name}")

        # List step2 outputs (final results)
        for p in sorted(step2_dir.iterdir()):
            if p.is_file() and allowed_file(p.name):
                result['step_outputs']['step2'].append(f"/outputs/{run_id}/step2/{p.name}")
                result['outputs'].append(f"/outputs/{run_id}/step2/{p.name}")

        result['banknote_used'] = selected_banknote['name']

        return jsonify(result)

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Generation timed out"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


# Static serving of sample images
@app.route('/samples/<filename>')
def serve_sample(filename):
    safe = secure_filename(filename)
    if not (SAMPLES_FOLDER / safe).exists():
        abort(404)
    return send_from_directory(SAMPLES_FOLDER, safe)

# Static serving of output images
@app.route('/outputs/<run_id>/<filename>')
def serve_output(run_id, filename):
    safe = secure_filename(filename)
    folder = OUTPUT_FOLDER / run_id
    if not (folder.exists() and (folder / safe).exists()):
        abort(404)
    return send_from_directory(folder, safe)

# Static serving of step output images
@app.route('/outputs/<run_id>/<step>/<filename>')
def serve_step_output(run_id, step, filename):
    safe = secure_filename(filename)
    if step not in ['step1', 'step2']:
        abort(404)
    folder = OUTPUT_FOLDER / run_id / step
    if not (folder.exists() and (folder / safe).exists()):
        abort(404)
    return send_from_directory(folder, safe)

@app.route('/hello')
def hello():
    return jsonify({"message": "Hello, World!"})

if __name__ == '__main__':
    # Configure scheduler for automatic cleanup
    vn_tz = pytz.timezone('Asia/Ho_Chi_Minh')
    scheduler = BackgroundScheduler(timezone=vn_tz)
    
    # Schedule cleanup at 3:00 AM Vietnam time every day
    scheduler.add_job(
        func=cleanup_old_files,
        trigger=CronTrigger(hour=3, minute=0, timezone=vn_tz),
        id='cleanup_job',
        name='Daily cleanup of old files',
        replace_existing=True
    )
    
    scheduler.start()
    print(f"[SCHEDULER] Cleanup job scheduled at 3:00 AM Vietnam time (UTC+7)", flush=True)
    print(f"[SCHEDULER] Files older than {CLEANUP_AGE_HOURS} hours will be deleted", flush=True)
    
    try:
        # for development only
        port = int(os.environ.get('FLASK_PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=True)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        print("[SCHEDULER] Scheduler stopped", flush=True)