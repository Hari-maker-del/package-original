from typing import List, Optional
from pydantic import BaseModel, Field

class ProductInfo(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    manufacturer: Optional[str] = None
    mrp: Optional[str] = None
    net_quantity: Optional[str] = None
    batch_lot: Optional[str] = None
    manufacturing_date: Optional[str] = None
    expiry_best_before: Optional[str] = None

class ComplianceCheck(BaseModel):
    check: str
    status: str
    message: str

class Issue(BaseModel):
    issue_type: str
    description: str
    severity: str = "medium"
    recommendation: str

class ComplianceResult(BaseModel):
    checks: List[ComplianceCheck]
    score: Optional[float] = Field(default=None, ge=0, le=100)
    status: str
    summary: Optional[str] = None
    issues: List[Issue] = Field(default_factory=list)

class IngredientAnalysis(BaseModel):
    name: str
    purpose: Optional[str] = None
    details: Optional[str] = None

class VisualEvidence(BaseModel):
    type: str
    label: str
    value: str

class AnalysisResponse(BaseModel):
    analysis_version: str = "1.1.0"
    product: ProductInfo
    ingredients: List[str]
    ingredient_analysis: List[IngredientAnalysis] = Field(default_factory=list)
    allergens: List[str]
    declared_allergens: List[str] = Field(default_factory=list)
    allergen_declaration_detected: bool = False
    compliance: ComplianceResult
    visual_evidence: List[VisualEvidence]
    raw_ocr_text: str
