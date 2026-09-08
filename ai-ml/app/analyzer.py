import re

DATE_RE = re.compile(r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b")


def _label_value(text: str, labels: list[str]) -> str | None:
    joined = "|".join(re.escape(x) for x in sorted(labels, key=len, reverse=True))
    match = re.search(rf"(?:{joined})\s*[:\-]?\s*([^\n]+)", text, re.I)
    return match.group(1).strip(" .:-") if match else None


def _normalize_date_text(value: str) -> str:
    # OCR often reads a slash as a colon in dates, e.g. 12:03/2026.
    return re.sub(r"(?<=\d):(?=\d)", "/", value)


def _date_after_label(text: str, labels: list[str]) -> str | None:
    for label in sorted(labels, key=len, reverse=True):
        match = re.search(rf"(?:{re.escape(label)})\s*[:\-]?\s*([^\n]+)", text, re.I)
        if match:
            date = DATE_RE.search(_normalize_date_text(match.group(1)))
            if date:
                return date.group(0)
    return None


def _parse_dates(text: str):
    mfg = _date_after_label(text, ["Manufacturing Date", "Manufactured", "MFG", "MFD", "Packed On", "PKD"])
    exp = _date_after_label(text, ["Expiry Date", "Expiry", "Best Before", "Use By", "EXP"])
    # If labels are absent, retain the OCR dates only when there are exactly two.
    # This avoids silently assigning the first/last date when packaging contains
    # several unrelated dates.
    dates = DATE_RE.findall(_normalize_date_text(text))
    if mfg and not exp:
        remaining = [d for d in dates if d != mfg]
        if len(remaining) == 1:
            exp = remaining[0]
    if exp and not mfg:
        remaining = [d for d in dates if d != exp]
        if len(remaining) == 1:
            mfg = remaining[0]
    if mfg or exp:
        return mfg, exp
    if len(dates) == 2:
        return dates[0], dates[1]
    return (dates[0], None) if len(dates) == 1 else (None, None)


def extract_product_info(text: str) -> dict:
    product = {"name": None, "brand": None, "manufacturer": None, "mrp": None, "net_quantity": None, "batch_lot": None, "manufacturing_date": None, "expiry_best_before": None}
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    mrp = re.search(r"\b(?:MRP|M\.R\.P\.?|Maximum Retail Price|Rs\.?)\s*[:\-]?\s*(?:₹|Rs\.?\s*)?([0-9]+(?:\.[0-9]{1,2})?)\b|₹\s*([0-9]+(?:\.[0-9]{1,2})?)\b", text, re.I)
    if mrp:
        product["mrp"] = mrp.group(1) or mrp.group(2)

    qty = re.search(r"\b(?:Net\s*(?:Quantity|Qty)|Net Wt\.?|Net Weight)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)\s*(kg|g|mg|l|ml)\b", text, re.I)
    if qty:
        product["net_quantity"] = f"{qty.group(1)} {qty.group(2)}"
    else:
        # Tesseract may read a printed lowercase 'g' as the digit 9 directly after a weight.
        qty_ocr = re.search(r"\b(?:Net\s*(?:Quantity|Qty)|Net Wt\.?|Net Weight)\s*[:\-]?\s*([0-9]+)9\b", text, re.I)
        if qty_ocr:
            product["net_quantity"] = f"{qty_ocr.group(1)} g"

    explicit_brand = _label_value(text, ["Brand"])
    product["brand"] = explicit_brand
    product["manufacturer"] = _label_value(text, ["Manufactured & Packed by", "Manufactured by", "Marketed by", "Packed by", "Manufacturer"])

    batch = _label_value(text, ["Batch Number", "Batch No", "Lot Number", "Lot No", "Batch", "Lot"])
    if batch:
        cleaned = re.sub(r"^(?:no|na|number)\.?\s*", "", batch, flags=re.I).strip()
        product["batch_lot"] = cleaned or None

    product["manufacturing_date"], product["expiry_best_before"] = _parse_dates(text)

    explicit_name = _label_value(text, ["Product Name", "Product", "Name"])
    if explicit_name:
        product["name"] = explicit_name
    else:
        ingredient_index = next((i for i, line in enumerate(lines) if re.match(r"^ingredients?\s*[:\-]", line, re.I)), len(lines))
        candidates = []
        for line in lines[:ingredient_index]:
            low = line.lower()
            if len(line) < 3 or any(x in low for x in ["nutrition", "energy", "protein", "carbohydrate", "total fat", "sodium", "mrp", "net quantity", "manufactured", "packed by", "maximum retail"]):
                continue
            if DATE_RE.search(line) or re.search(r"\b\d+(?:\.\d+)?\s*(?:g|kg|ml|l)\b", line, re.I):
                continue
            if re.search(r"^(contains|may contain|allergen)\b", line, re.I):
                continue
            candidates.append(line)
        if candidates:
            product["name"] = candidates[1] if product["brand"] and candidates[0].lower() == product["brand"].lower() and len(candidates) > 1 else candidates[0]
            if not product["brand"] and len(candidates) > 1:
                # Do not pretend the first line is definitely a brand.
                product["brand"] = candidates[0]
                product["name"] = candidates[1]
    return product
