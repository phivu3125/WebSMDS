# app.py
import os
import shutil
import subprocess
import uuid
from flask import Flask, request, render_template, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

UPLOAD_FOLDER = Path("uploads")
OUTPUT_FOLDER = Path("outputs")
SAMPLES_FOLDER = Path("samples")  # optional: place pre-made sample images here
ALLOWED_EXT = {"png","jpg","jpeg","webp"}

API_KEY = os.environ.get("GEMINI_API_KEY")  # put your API key in .env or env var
MODEL_NAME = os.environ.get("GEMINI_MODEL","imagen-4.0-generate-001")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20 MB limit per upload

UPLOAD_FOLDER.mkdir(exist_ok=True)
OUTPUT_FOLDER.mkdir(exist_ok=True)
SAMPLES_FOLDER.mkdir(exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT


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
    # list sample images in /samples for convenience
    samples = [p.name for p in SAMPLES_FOLDER.iterdir() if p.is_file() and allowed_file(p.name)]
    return render_template('index.html', samples=samples)


@app.route('/run', methods=['POST'])
def run_generation():
    # input_image: required
    # sample_image: can be uploaded or chosen from existing samples
    if 'input_image' not in request.files:
        return jsonify({"error": "input_image field is required"}), 400

    input_file = request.files['input_image']
    if input_file.filename == '' or not allowed_file(input_file.filename):
        return jsonify({"error": "Invalid input image"}), 400

    # Decide sample image path: either uploaded or chosen by name
    sample_path = None

    # Option 1: sample uploaded
    if 'sample_image' in request.files and request.files['sample_image'].filename != '':
        sample_file = request.files['sample_image']
        if not allowed_file(sample_file.filename):
            return jsonify({"error": "Invalid sample image"}), 400
        # save sample
        sample_fname = secure_filename(sample_file.filename)
        sample_id = f"{uuid.uuid4().hex}_{sample_fname}"
        sample_path = UPLOAD_FOLDER / sample_id
        sample_file.save(sample_path)

        # resize sample image
        resize_image(sample_path)
    else:
        # Option 2: sample chosen from existing samples by filename (form field 'sample_choice')
        choice = request.form.get('sample_choice')
        if choice:
            candidate = SAMPLES_FOLDER / Path(choice).name
            if candidate.exists() and allowed_file(candidate.name):
                sample_path = candidate

    if sample_path is None:
        return jsonify({"error": "No sample image provided"}), 400

    # Save input image
    input_fname = secure_filename(input_file.filename)
    input_id = f"{uuid.uuid4().hex}_{input_fname}"
    input_path = UPLOAD_FOLDER / input_id
    input_file.save(input_path)

    # resize input image
    resize_image(input_path)

    # Prepare unique output folder for this run
    run_id = uuid.uuid4().hex
    this_outdir = OUTPUT_FOLDER / run_id
    this_outdir.mkdir(parents=True, exist_ok=True)

    # Build command — replicate the CLI you provided
    # python3 generate.py --images <input> <sample> --prompt "" --outdir <outdir> --api-key <key> --model <model>
    if not API_KEY:
        return jsonify({"error": "Server missing GEMINI_API_KEY environment variable"}), 500

    cmd = [
        'python', 'generate.py',
        '--images', str(input_path), str(sample_path),
        '--prompt', '',
        '--outdir', str(this_outdir),
        '--api-key', API_KEY,
        '--model', MODEL_NAME
    ]

    try:
        # run the process and capture output
        completed = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Generation timed out"}), 500

    # Collect stdout/stderr and exit code
    result = {
        'returncode': completed.returncode,
        'stdout': completed.stdout,
        'stderr': completed.stderr,
        'outputs': []
    }

    # If the tool wrote images into this_outdir, list them
    for p in sorted(this_outdir.iterdir()):
        if p.is_file() and allowed_file(p.name):
            result['outputs'].append(f"/outputs/{run_id}/{p.name}")

    return jsonify(result)


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

@app.route('/hello')
def hello():
    return jsonify({"message": "Hello, World!"})

if __name__ == '__main__':
    # for development only
    port = int(os.environ.get('FLASK_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)