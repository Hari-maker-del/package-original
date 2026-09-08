import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "ai-ml"))

from app.analyzer import extract_product_info
from app.allergens import detect_allergens, detect_allergen_declaration
from app.compliance import check_compliance
from app.ingredients import extract_ingredients


def test_extract_labeled_product_fields():
    text = """Brand: Acme\nProduct Name: Chocolate Bar\nMRP: ₹199\nNet Quantity: 100 g\nManufactured by: Acme Foods Pvt Ltd\nBatch No: B123\nMFG: 12/03/2026\nEXP: 12/09/2026\nIngredients: Wheat flour, sugar, milk powder\nContains: Wheat, Milk"""
    p = extract_product_info(text)
    assert p["brand"] == "Acme"
    assert p["name"] == "Chocolate Bar"
    assert p["mrp"] == "199"
    assert p["net_quantity"] == "100 g"
    assert p["batch_lot"] == "B123"
    assert p["manufacturing_date"] == "12/03/2026"
    assert p["expiry_best_before"] == "12/09/2026"


def test_ocr_date_colon_normalization():
    p = extract_product_info("Product Name: Cookies\nMFG 12:03/2026\nEXP 12/09/2026")
    assert p["manufacturing_date"] == "12/03/2026"
    assert p["expiry_best_before"] == "12/09/2026"


def test_ingredient_split_keeps_parentheses():
    text = "Ingredients: flour, cocoa (processed with alkali), sugar, milk powder\nContains: Wheat, Milk"
    assert extract_ingredients(text) == ["flour", "cocoa (processed with alkali)", "sugar", "milk powder"]


def test_allergen_declaration_requires_explicit_contains():
    text = "Ingredients: wheat flour, milk powder\nMay contain: nuts"
    assert "gluten" in detect_allergens(text)
    assert "milk" in detect_allergens(text)
    declared, found = detect_allergen_declaration(text)
    assert declared == []
    assert found is False


def test_compliance_does_not_mark_missing_declaration_as_pass():
    product = {"name":"Bar", "manufacturer":"Acme", "mrp":"10", "net_quantity":"50 g", "batch_lot":"A1", "manufacturing_date":"01/01/2026", "expiry_best_before":"01/07/2026"}
    result = check_compliance(product, ["wheat flour"], ["gluten"], [], False)
    allergen_check = next(x for x in result["checks"] if x["check"] == "Allergen declaration")
    assert allergen_check["status"] == "Verify"
    assert result["status"] == "Requires Verification"


def test_sample_ocr_recovery_for_quantity_and_expiry():
    text = "Net Quantity 2009\nMFG 12/03/2026\n12/09/2026"
    p = extract_product_info(text)
    assert p["net_quantity"] == "200 g"
    assert p["manufacturing_date"] == "12/03/2026"
    assert p["expiry_best_before"] == "12/09/2026"
