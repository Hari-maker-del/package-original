def build_visual_evidence(product: dict, ingredients: list, allergens: list) -> list:

    evidence = []

    # Product name
    if product.get("name"):
        evidence.append({
            "type": "ocr_text",
            "label": "Product Name",
            "value": product["name"]
        })

    # Manufacturer
    if product.get("manufacturer"):
        evidence.append({
            "type": "ocr_text",
            "label": "Manufacturer",
            "value": product["manufacturer"]
        })

    # MRP
    if product.get("mrp"):
        evidence.append({
            "type": "ocr_text",
            "label": "MRP",
            "value": product["mrp"]
        })

    # Net quantity
    if product.get("net_quantity"):
        evidence.append({
            "type": "ocr_text",
            "label": "Net Quantity",
            "value": product["net_quantity"]
        })

    # Batch
    if product.get("batch_lot"):
        evidence.append({
            "type": "ocr_text",
            "label": "Batch / Lot",
            "value": product["batch_lot"]
        })

    # Manufacturing date
    if product.get("manufacturing_date"):
        evidence.append({
            "type": "ocr_text",
            "label": "Manufacturing Date",
            "value": product["manufacturing_date"]
        })

    # Expiry / Best Before
    if product.get("expiry_best_before"):
        evidence.append({
            "type": "ocr_text",
            "label": "Best Before / Expiry",
            "value": product["expiry_best_before"]
        })

    # Ingredients
    if ingredients:
        evidence.append({
            "type": "ocr_text",
            "label": "Ingredients",
            "value": ", ".join(ingredients)
        })

    # Allergens
    if allergens:
        evidence.append({
            "type": "ocr_text",
            "label": "Allergens",
            "value": ", ".join(allergens)
        })

    return evidence