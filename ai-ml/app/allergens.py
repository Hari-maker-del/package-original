import re

SUPPORTED_ALLERGENS = {
    "peanuts": ["peanut", "peanuts"],
    "tree_nuts": ["almond", "cashew", "walnut", "pistachio", "hazelnut", "pecan", "macadamia", "other nuts"],
    "milk": ["milk", "milk powder", "whey", "casein", "lactose"],
    "soy": ["soy", "soya", "soybean"],
    "gluten": ["wheat", "barley", "rye", "gluten"],
    "egg": ["egg", "eggs", "albumin"],
    "fish": ["fish"],
    "shellfish": ["shellfish", "crab", "prawn", "shrimp", "lobster", "mollusc", "molluscs"],
}


def _contains_keyword(text: str, keyword: str) -> bool:
    return bool(re.search(r"(?<![A-Za-z])" + re.escape(keyword) + r"(?![A-Za-z])", text, re.I))


def detect_allergens(text: str) -> list:
    return [name for name, keywords in SUPPORTED_ALLERGENS.items() if any(_contains_keyword(text, k) for k in keywords)]


def detect_allergen_declaration(text: str) -> tuple[list, bool]:
    """Return allergens in an explicit declaration and whether such a declaration exists.

    'May contain' is treated as a precautionary statement, not as proof of an explicit
    allergen declaration, so it does not make the declaration check pass.
    """
    match = re.search(
        r"(?:^|\n)\s*(contains|allergens?)\s*[:\-]?\s*(.+?)(?=\n\s*[A-Z][A-Za-z /&-]{2,}:|$)",
        text,
        re.I | re.S,
    )
    if not match:
        return [], False
    declaration = match.group(2).strip()
    declared = [name for name, keywords in SUPPORTED_ALLERGENS.items() if any(_contains_keyword(declaration, k) for k in keywords)]
    return declared, True
