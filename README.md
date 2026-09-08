# PackSure AI

PackSure AI is an AI-assisted packaging information and compliance-review platform. It combines a React frontend, an Express API, PostgreSQL persistence, and a FastAPI/Tesseract analysis service.

## Architecture

Frontend → Express API → FastAPI AI → PostgreSQL

The browser talks only to the Express API. The API handles authentication, image uploads, inspection persistence, reports, and QR verification. The AI service performs OCR, ingredient extraction, allergen detection, and supported information checks.

## Quick start with Docker

1. Copy `.env.example` to `.env`.
2. Replace `JWT_SECRET` with a random value of at least 32 characters.
3. Run `docker compose up --build`.
4. Open `http://localhost`. In Docker mode the browser uses the same-origin `/api` proxy, so the stack does not depend on a hard-coded localhost API address.

PostgreSQL schema is initialized automatically from `database.sql` on a fresh database volume. Uploaded inspection images are persisted in the `api_uploads` Docker volume.

## Existing database upgrade

For an existing deployment created from an older PackSure schema:

1. Back up PostgreSQL.
2. Run `migration.sql` once.
3. Restart the API.

Do not run `migration.sql` as a substitute for `database.sql` on a brand-new database.

## Local development

### AI

Install Tesseract OCR and the required language packs (`eng`, `hin`, `tam`, `mal`, `tel`) on the host, then:

```bash
cd ai-ml
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### API

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Set `DATABASE_URL`, `JWT_SECRET`, `AI_SERVICE_URL`, and `FRONTEND_URL` appropriately.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` if the API is not at `http://localhost:5000/api`.

## Reports

Inspection reports can be downloaded as CSV or opened as a print-ready HTML report. Use the browser's **Print → Save as PDF** to create a PDF without adding a server-side PDF dependency.

## QR verification

Every saved PackSure inspection receives a unique verification token and verification URL. Scanning that PackSure URL can be verified against the stored inspection. External product QR URLs are intentionally reported as readable but not authenticated by PackSure.

## Scope note

The compliance score measures supported packaging-information checks detected by OCR/rules. It is not legal certification. Final regulatory decisions require human review against the applicable standard.
