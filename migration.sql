-- PackSure AI schema upgrade guide
-- Fresh deployment: run database.sql only. It already contains every current table/column.
-- Existing deployment: back up the database, then run this migration once.
-- The statements are idempotent and safe to re-run.

ALTER TABLE inspections ADD COLUMN IF NOT EXISTS raw_ocr_text TEXT;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS analysis_version VARCHAR(30);
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS visual_evidence JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS detected_allergens JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS declared_allergens JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS qr_token UUID;
UPDATE inspections SET qr_token=gen_random_uuid() WHERE qr_token IS NULL;
ALTER TABLE inspections ALTER COLUMN qr_token SET DEFAULT gen_random_uuid();
ALTER TABLE inspections ALTER COLUMN qr_token SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_inspections_qr_token ON inspections(qr_token);
ALTER TABLE inspections ALTER COLUMN score TYPE NUMERIC(5,2);

CREATE TABLE IF NOT EXISTS qr_verifications (
 id BIGSERIAL PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 inspection_id BIGINT REFERENCES inspections(id) ON DELETE SET NULL,
 payload TEXT NOT NULL,
 status VARCHAR(30) NOT NULL DEFAULT 'Unverified' CHECK (status IN ('Verified','Unverified')),
 message TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_qr_verifications_user_id ON qr_verifications(user_id);
