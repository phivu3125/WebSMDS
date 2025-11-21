# app.py
import os
import subprocess
import uuid
import json
from flask import Flask, request, render_template, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image

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

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20 MB limit per upload

UPLOAD_FOLDER.mkdir(exist_ok=True)
OUTPUT_FOLDER.mkdir(exist_ok=True)
SAMPLES_FOLDER.mkdir(exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT


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


def resize_image(image_path, target_size=(512, 512)):
    """
    Resize image to target size directly, may distort aspect ratio
    Uses LANCZOS resampling for high quality
    """
    try:
        with Image.open(image_path) as img:
            # Convert RGBA to RGB if needed
            if img.mode == 'RGBA':
                img = img.convert('RGB')

            # Resize directly to target size
            img = img.resize(target_size, Image.Resampling.LANCZOS)

            img.save(image_path, quality=95)
            return True
    except Exception as e:
        print(f"Error resizing image {image_path}: {e}")
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
        integration_prompt = """Place the first image into the banknote design without creating any frames, borders, or decorative edges around it. Simply insert the image into available empty spaces, being extremely careful to not cover any text, numbers, or existing printed elements. The image should blend directly with the banknote's artistic style without any additional framing or borders. Position and scale the image to fit naturally within open areas while preserving all original text and printed information completely visible and intact."""

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
    # for development only
    port = int(os.environ.get('FLASK_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)