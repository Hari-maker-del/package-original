FROM python:3.11-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin tesseract-ocr-tam tesseract-ocr-mal tesseract-ocr-tel \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY ai-ml/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY ai-ml/app ./app
CMD ["sh","-c","uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
