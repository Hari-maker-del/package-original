from PIL import Image, ImageOps, ImageFilter


def preprocess_image(image: Image.Image) -> Image.Image:
    image = image.convert("RGB")
    max_side = max(image.size)
    if max_side < 1800:
        scale = 1800 / max_side
        image = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    image = ImageOps.grayscale(image)
    image = ImageOps.autocontrast(image)
    image = image.filter(ImageFilter.MedianFilter(size=3))
    return image
