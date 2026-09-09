-- PackSure AI: safe inspection schema migration
-- Run this once in the Supabase SQL Editor.
-- This migration is additive and does not delete existing inspection data.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Core inspection table. If it already exists, the ALTER statements below
-- add any columns introduced by the current PackSure backend.
CREATE TABLE IF NOT EXISTS inspections (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT,
    product_name TEXT,
    brand TEXT,
    manufacturer TEXT,
    batch_number TEXT,
    mrp NUMERIC(10,2),
    net_quantity TEXT,
    manufacturing_date DATE,
    expiry_date DATE,
    score NUMERIC(5,2),
    status VARCHAR(30) NOT NULL DEFAULT 'Requires Verification',
    raw_ocr_text TEXT,
    analysis_version VARCHAR(30),
    visual_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    detected_allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
    declared_allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
    qr_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE inspections ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS manufacturer TEXT;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS batch_number TEXT;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS mrp NUMERIC(10,2);
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS net_quantity TEXT;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS manufacturing_date DATE;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS expiry_date DATE;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS score NUMERIC(5,2);
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Requires Verification';
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS raw_ocr_text TEXT;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS analysis_version VARCHAR(30);
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS visual_evidence JSONB DEFAULT '[]'::jsonb;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS detected_allergens JSONB DEFAULT '[]'::jsonb;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS declared_allergens JSONB DEFAULT '[]'::jsonb;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS qr_token UUID DEFAULT gen_random_uuid();
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

UPDATE inspections SET status='Requires Verification' WHERE status IS NULL OR status='';
UPDATE inspections SET visual_evidence='[]'::jsonb WHERE visual_evidence IS NULL;
UPDATE inspections SET detected_allergens='[]'::jsonb WHERE detected_allergens IS NULL;
UPDATE inspections SET declared_allergens='[]'::jsonb WHERE declared_allergens IS NULL;
UPDATE inspections SET created_at=NOW() WHERE created_at IS NULL;
UPDATE inspections SET qr_token=gen_random_uuid() WHERE qr_token IS NULL;

-- Child tables used by the result, ingredient, compliance and issue views.
CREATE TABLE IF NOT EXISTS ingredients (
    id BIGSERIAL PRIMARY KEY,
    inspection_id BIGINT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    purpose TEXT,
    details TEXT,
    allergen TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Detected'
);

ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS inspection_id BIGINT;
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS purpose TEXT;
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS allergen TEXT;
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Detected';
UPDATE ingredients SET status='Detected' WHERE status IS NULL OR status='';

CREATE TABLE IF NOT EXISTS compliance_checks (
    id BIGSERIAL PRIMARY KEY,
    inspection_id BIGINT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    requirement TEXT NOT NULL,
    detected_information TEXT,
    status VARCHAR(30) NOT NULL,
    details TEXT
);

ALTER TABLE compliance_checks ADD COLUMN IF NOT EXISTS inspection_id BIGINT;
ALTER TABLE compliance_checks ADD COLUMN IF NOT EXISTS requirement TEXT;
ALTER TABLE compliance_checks ADD COLUMN IF NOT EXISTS detected_information TEXT;
ALTER TABLE compliance_checks ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Verify';
ALTER TABLE compliance_checks ADD COLUMN IF NOT EXISTS details TEXT;
UPDATE compliance_checks SET status='Verify' WHERE status IS NULL OR status='';

CREATE TABLE IF NOT EXISTS issues (
    id BIGSERIAL PRIMARY KEY,
    inspection_id BIGINT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    issue_type TEXT,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium',
    recommendation TEXT
);

ALTER TABLE issues ADD COLUMN IF NOT EXISTS inspection_id BIGINT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS issue_type TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS severity VARCHAR(20) DEFAULT 'medium';
ALTER TABLE issues ADD COLUMN IF NOT EXISTS recommendation TEXT;
UPDATE issues SET severity='medium' WHERE severity IS NULL OR severity='';

CREATE TABLE IF NOT EXISTS qr_verifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    inspection_id BIGINT REFERENCES inspections(id) ON DELETE SET NULL,
    payload TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Unverified',
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qr_verifications ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE qr_verifications ADD COLUMN IF NOT EXISTS inspection_id BIGINT;
ALTER TABLE qr_verifications ADD COLUMN IF NOT EXISTS payload TEXT;
ALTER TABLE qr_verifications ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Unverified';
ALTER TABLE qr_verifications ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE qr_verifications ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes required by the current API queries.
CREATE INDEX IF NOT EXISTS idx_inspections_user_id ON inspections(user_id);
CREATE INDEX IF NOT EXISTS idx_inspections_created_at ON inspections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);
CREATE INDEX IF NOT EXISTS idx_ingredients_inspection_id ON ingredients(inspection_id);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_inspection_id ON compliance_checks(inspection_id);
CREATE INDEX IF NOT EXISTS idx_issues_inspection_id ON issues(inspection_id);
CREATE INDEX IF NOT EXISTS idx_qr_verifications_user_id ON qr_verifications(user_id);

COMMIT;
