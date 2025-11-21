from google import genai
from google.genai import types
from typing import List, Union
from PIL import Image
import io
import os
import json
import argparse

class GeminiImageGeneration:
    def __init__(self, model: str, api_key: str):
        self.model = model
        self.api_key = api_key
        self.client = genai.Client(api_key=api_key)

    def generate(
        self,
        prompt: str,
        image_paths: List[str] = None,
        num_images: int = 1,
    ) -> List[Image.Image]:

        parts: List[Union[types.Part, str]] = []
        if image_paths:
            for image_path in image_paths:
                uploaded = self.client.files.upload(file=image_path)
                parts.append(uploaded)
        parts.append(prompt)

        response = self.client.models.generate_content(
            model=self.model,
            contents=parts,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                candidate_count=num_images,
            ),
        )

        # Collect image outputs
        images: List[Image.Image] = []
        # The response contains candidates; we assume first candidate is fine
        candidate = response.candidates[0]
        for part in candidate.content.parts:
            if part.inline_data is not None and part.inline_data.data is not None:
                image_bytes = part.inline_data.data
                image = Image.open(io.BytesIO(image_bytes))
                images.append(image)

        return images

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate image using Google Gemini Developer model."
    )
    parser.add_argument(
        "-f", "--images",
        nargs='+',
        help="Các đường dẫn tới images (jpg, png)."
    )
    parser.add_argument(
        "-p", "--prompt",
        required=True,
        help="Prompt"
    )
    parser.add_argument(
        "-o", "--outdir",
        default="output",
        help="Output folder for generated image"
    )
    parser.add_argument(
        "-k", "--api-key",
        required=True,
        help="API key của bạn để gọi Gemini Developer API."
    )
    parser.add_argument(
        "-m", "--model",
        default="gemini-2.0-flash-preview-image-generation",
        help="Model muốn dùng (mặc định: gemini-2.0-flash-preview-image-generation)."
    )
    args = parser.parse_args()

    # Validate that we have images for step 1
    if not args.images:
        print("ERROR: No images provided. This script requires at least one image.")
        exit(1)

    # Validate that all image files exist
    missing_files = []
    for img_path in args.images:
        if not os.path.exists(img_path):
            missing_files.append(img_path)

    if missing_files:
        print(f"ERROR: The following image files do not exist: {missing_files}")
        exit(1)

    model = GeminiImageGeneration(
        model=args.model,
        api_key=args.api_key
    )
    images = model.generate(
        prompt=args.prompt,
        image_paths=args.images,
    )
    # save image to args.output/
    os.makedirs(args.outdir, exist_ok=True)
    print(f"Saving {len(images)} image(s)")
    for i, image in enumerate(images):
        # Use consistent naming based on whether we're doing step 1 or step 2
        # Step 1: styled_image.png, Step 2: final_banknote.png (by checking if prompt contains "integrate")
        if "integrate" in args.prompt.lower():
            filename = "final_banknote.png"
        else:
            filename = "styled_image.png"
        path = os.path.join(args.outdir, filename)
        image.save(path)
        print(f"Saved image: {path}")
