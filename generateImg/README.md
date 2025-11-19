```bash
pip install -r requirements.txt
```

Download two sample images
```bash
mkdir imgs

wget https://upload.wikimedia.org/wikipedia/commons/6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg \
    -O imgs/polar_bear.jpg

wget https://pics.clipartpng.com/Tea_Cup_PNG_Clipart-606.png \
    -O imgs/white_cup.png
```

Get an API key from https://aistudio.google.com/

Generate!
```bash
python3 generate.py \
    --images imgs/anhDuy.jpg imgs/Note4.jpg \
    --prompt "" \
    --outdir output \
    --api-key AIzaSyCyOxBXu88tLZEezCuHWJc4aun1RGYfDR8 \
    --model gemini-2.5-flash-image
```
