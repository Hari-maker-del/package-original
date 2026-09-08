import re

PURPOSE_RULES = [
    (re.compile(r"sugar|glucose|fructose|syrup|maltodextrin", re.I), "Sweetener", "Provides sweetness and/or carbohydrate."),
    (re.compile(r"flour|starch|cereal|wheat|rice|corn|maize|oat", re.I), "Base / thickener", "Provides structure, bulk, or thickening."),
    (re.compile(r"oil|fat|butter|shortening", re.I), "Fat source", "Provides fat, texture, and mouthfeel."),
    (re.compile(r"salt|sodium", re.I), "Seasoning", "Adds saltiness and supports flavor."),
    (re.compile(r"lecithin|mono- and diglycerides|emulsifier", re.I), "Emulsifier", "Helps ingredients remain uniformly mixed."),
    (re.compile(r"citric acid|malic acid|lactic acid|acid", re.I), "Acidity regulator", "Helps control acidity and flavor."),
    (re.compile(r"preservative|sorbate|benzoate", re.I), "Preservative", "Helps slow microbial spoilage."),
    (re.compile(r"cocoa|chocolate|vanilla|flavou?r|spice", re.I), "Flavoring", "Contributes flavor and aroma."),
]

def _split_top_level(value: str) -> list[str]:
    parts, current, depth = [], [], 0
    for char in value:
        if char == "(": depth += 1
        elif char == ")": depth = max(0, depth - 1)
        if char in ",;" and depth == 0:
            item = "".join(current).strip(" .")
            if item: parts.append(item)
            current = []
        else: current.append(char)
    item = "".join(current).strip(" .")
    if item: parts.append(item)
    return parts

def extract_ingredients(text: str) -> list:
    match = re.search(r"\bIngredients?\s*[:\-]?\s*(.*?)(?=\n\s*(?:Contains|Allergen|Manufactured|Packed|Nutrition|Nutritional|Net\s+Quantity|MRP)\b|$)", text, re.I | re.S)
    if not match: return []
    value = re.sub(r"\s+", " ", match.group(1)).strip()
    value = re.sub(r"\b(?:and|etc\.)\s*$", "", value, flags=re.I).strip(" .")
    return _split_top_level(value)

def describe_ingredients(ingredients: list[str]) -> list[dict]:
    result=[]
    for name in ingredients:
        purpose="Ingredient";details="Purpose could not be confidently inferred from the OCR text."
        for pattern,label,description in PURPOSE_RULES:
            if pattern.search(name): purpose,details=label,description;break
        result.append({"name":name,"purpose":purpose,"details":details})
    return result
