import os
import pytesseract
from PIL import Image
from pytesseract import TesseractNotFoundError, TesseractError

def _language():
    return os.getenv("TESSERACT_LANG", "eng+hin+tam+mal+tel")

def extract_text(image: Image.Image) -> str:
    try:
        text = pytesseract.image_to_string(image, config="--psm 6", lang=_language())
    except (TesseractNotFoundError, TesseractError) as exc:
        raise RuntimeError("Tesseract OCR is unavailable or the configured language packs are missing.") from exc
    return text.strip()
