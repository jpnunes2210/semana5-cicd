# Imagem de DESENVOLVIMENTO do backend (Django runserver com autoreload)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    DJANGO_DEBUG=True \
    CORS_ALLOWED_ORIGINS=http://localhost:3000

WORKDIR /app

# Dependencias primeiro para aproveitar o cache de camadas
COPY requirements.txt .
RUN pip install -r requirements.txt

# O codigo e copiado, mas em dev ele e sobrescrito pelo bind mount (-v)
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
