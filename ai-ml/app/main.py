from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from app.preprocessing import preprocess_image
from app.ocr import extract_text
from app.analyzer import extract_product_info
from app.ingredients import extract_ingredients, describe_ingredients
from app.allergens import detect_allergens, detect_allergen_declaration
from app.compliance import check_compliance
from app.evidence import build_visual_evidence
from app.schemas import AnalysisResponse
import io
import os

app = FastAPI(title="PackSure AI", version="1.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def home(): return {"service":"PackSure AI","status":"ok","version":"1.1.0"}

@app.post("/ai/analyze", response_model=AnalysisResponse)
async def analyze(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are supported.")
    contents = await image.read()
    max_upload = int(os.getenv("MAX_UPLOAD_MB", "10")) * 1024 * 1024
    if len(contents) > max_upload:
        raise HTTPException(status_code=413, detail=f"Image must be {max_upload // (1024 * 1024)} MB or smaller.")
    try:
        original = Image.open(io.BytesIO(contents))
        if max(original.size) > 6000 or original.width * original.height > 25_000_000:
            raise HTTPException(status_code=413, detail="Image dimensions are too large. Please upload a smaller image.")
        original = original.convert("RGB")
        processed = preprocess_image(original)
        raw_text = extract_text(processed)
        product = extract_product_info(raw_text)
        ingredients = extract_ingredients(raw_text)
        ingredient_analysis = describe_ingredients(ingredients)
        allergens = detect_allergens(raw_text)
        declared, declaration_found = detect_allergen_declaration(raw_text)
        compliance = check_compliance(product, ingredients, allergens, declared, declaration_found)
        evidence = build_visual_evidence(product, ingredients, allergens)
        return {"analysis_version":"1.1.0","product":product,"ingredients":ingredients,"ingredient_analysis":ingredient_analysis,"allergens":allergens,"declared_allergens":declared,"allergen_declaration_detected":declaration_found,"compliance":compliance,"visual_evidence":evidence,"raw_ocr_text":raw_text}
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid readable image.") from exc
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {exc}") from exc
