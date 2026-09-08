def check_compliance(product: dict, ingredients: list, allergens: list, declared_allergens: list | None = None, has_allergen_declaration: bool = False) -> dict:
    declared_allergens = declared_allergens or []
    checks = []

    def add(name, value, message):
        checks.append({"check": name, "status": "Pass" if value else "Verify", "message": message})

    add("Product name", bool(product.get("name")), "Product name detected from OCR." if product.get("name") else "Product name could not be confidently detected.")
    add("Manufacturer", bool(product.get("manufacturer")), "Manufacturer information detected." if product.get("manufacturer") else "Manufacturer information is missing or unclear.")
    add("MRP", bool(product.get("mrp")), "MRP detected." if product.get("mrp") else "MRP could not be confidently detected.")
    add("Net quantity", bool(product.get("net_quantity")), "Net quantity detected." if product.get("net_quantity") else "Net quantity could not be confidently detected.")
    add("Batch / Lot", bool(product.get("batch_lot")), "Batch / lot information detected." if product.get("batch_lot") else "Batch / lot information could not be confidently detected.")
    add("Manufacturing date", bool(product.get("manufacturing_date")), "Manufacturing date detected." if product.get("manufacturing_date") else "Manufacturing date could not be confidently detected.")
    add("Best before / expiry", bool(product.get("expiry_best_before")), "Best before / expiry information detected." if product.get("expiry_best_before") else "Best before / expiry information could not be confidently detected.")
    add("Ingredients", bool(ingredients), "Ingredient declaration detected." if ingredients else "Ingredient declaration could not be confidently detected.")

    if allergens:
        if not has_allergen_declaration:
            checks.append({"check": "Allergen declaration", "status": "Verify", "message": "Potential allergens were detected, but an explicit Contains/Allergen declaration was not confidently detected."})
        elif set(allergens).issubset(set(declared_allergens)):
            checks.append({"check": "Allergen declaration", "status": "Pass", "message": "Detected potential allergens are represented in the detected declaration."})
        else:
            checks.append({"check": "Allergen declaration", "status": "Verify", "message": "Potential allergens and the detected declaration do not fully match."})
    else:
        checks.append({"check": "Allergen declaration", "status": "Verify", "message": "No supported allergen keyword was detected. This is not proof of absence; manual verification is recommended."})

    passed = sum(c["status"] == "Pass" for c in checks)
    score = round(passed / len(checks) * 100, 2) if checks else None
    verify_count = sum(c["status"] != "Pass" for c in checks)
    status = "Pass" if verify_count == 0 else "Requires Verification"
    issues = [
        {"issue_type": "Information verification", "description": c["message"], "severity": "medium", "recommendation": f"Review the package for: {c['check']}."}
        for c in checks if c["status"] != "Pass"
    ]
    return {
        "checks": checks,
        "score": score,
        "status": status,
        "summary": f"{verify_count} supported check(s) require verification." if verify_count else "All supported information checks passed.",
        "issues": issues,
    }
