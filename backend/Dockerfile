# ---------- BUILD STAGE ----------
FROM python:3.11-alpine AS builder

WORKDIR /app

RUN apk add --no-cache build-base libffi-dev postgresql-dev jpeg-dev zlib-dev

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt && \
    pip install --prefix=/install --no-cache-dir gunicorn whitenoise

# ---------- FINAL STAGE ----------
FROM python:3.11-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Only runtime deps (lighter)
RUN apk add --no-cache libffi postgresql-libs jpeg zlib

# Copy installed packages from builder
COPY --from=builder /install /usr/local

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && gunicorn backend.wsgi:application --bind 0.0.0.0:8000"]