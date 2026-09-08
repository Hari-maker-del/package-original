-- PackSure AI PostgreSQL schema
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    account_type VARCHAR(30) NOT NULL DEFAULT 'User' CHECK (account_type IN ('User','Compliance Officer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inspections (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT,
    product_name TEXT,
    brand TEXT,
    manufacturer TEXT,
    batch_number TEXT,
    mrp NUMERIC(10,2) CHECK (mrp IS NULL OR mrp >= 0),
    net_quantity TEXT,
    manufacturing_date DATE,
    expiry_date DATE,
    score NUMERIC(5,2) CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    status VARCHAR(30) NOT NULL DEFAULT 'Requires Verification' CHECK (status IN ('Pass','Compliant','Requires Verification','Non-Compliant')),
    raw_ocr_text TEXT,
    analysis_version VARCHAR(30),
    visual_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    detected_allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
    declared_allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
    qr_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingredients (
    id BIGSERIAL PRIMARY KEY,
    inspection_id BIGINT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    purpose TEXT,
    details TEXT,
    allergen TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Detected' CHECK (status IN ('Detected','Reviewed','Flagged'))
);

CREATE TABLE IF NOT EXISTS compliance_checks (
    id BIGSERIAL PRIMARY KEY,
    inspection_id BIGINT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    requirement TEXT NOT NULL,
    detected_information TEXT,
    status VARCHAR(30) NOT NULL CHECK (status IN ('Pass','Verify','Non-Compliant')),
    details TEXT
);

CREATE TABLE IF NOT EXISTS issues (
    id BIGSERIAL PRIMARY KEY,
    inspection_id BIGINT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    issue_type TEXT,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
    recommendation TEXT
);

CREATE TABLE IF NOT EXISTS qr_verifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    inspection_id BIGINT REFERENCES inspections(id) ON DELETE SET NULL,
    payload TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Unverified',
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inspections_user_id ON inspections(user_id);
CREATE INDEX IF NOT EXISTS idx_inspections_created_at ON inspections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);
CREATE INDEX IF NOT EXISTS idx_ingredients_inspection_id ON ingredients(inspection_id);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_inspection_id ON compliance_checks(inspection_id);
CREATE INDEX IF NOT EXISTS idx_issues_inspection_id ON issues(inspection_id);
CREATE INDEX IF NOT EXISTS idx_qr_verifications_user_id ON qr_verifications(user_id);
