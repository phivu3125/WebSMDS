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
                candidate_count=num_images
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

    model = GeminiImageGeneration(
        model=args.model,
        api_key=args.api_key
    )
    images = model.generate(
        #prompt=args.prompt,
        prompt="""
Edit using two input images:
Image 1: the selfie of the man.
Image 2: the old Vietnamese 2-đồng banknote.
Create one final image of the 2-đồng banknote where:
Composition & placement
Use Image 2 as the base.
Completely remove the original group of people and flag inside the central picture area of the banknote.
Insert exactly Image 1 inside the border of Image 2. Converted into engraved line art.
Keep all original text, numbers, emblems, and outer ornamental borders of the banknote unchanged.
Style
Stylize the main content so it looks like it was engraved on the banknote, not pasted on top.
Use intaglio-style line engraving: dense cross-hatching, etched shading, no smooth gradients.
Apply a uniform color palette that exactly matches the ink and paper tone of the banknote.
The entire image must look like one mechanically printed note on fibrous old paper, with faded ink and fine texture.
Identity

Goal: it should look as if this 2-đồng banknote was originally printed with the Image 1 inside the border of Image 2 as the central portrait.
        """,
        image_paths=args.images,
    )
    # save image to args.output/
    os.makedirs(args.outdir, exist_ok=True)
    print(f"Saving {len(images)} image(s)")
    for i, image in enumerate(images):
        filename = f"image_hcmus1_{i+1}.png"
        path = os.path.join(args.outdir, filename)
        image.save(path)
        print(f"Saved image: {path}")
