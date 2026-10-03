from django.http import JsonResponse
from django.views.decorators.http import require_GET

ITEMS = [
    "Configurar Docker",
    "Automatizar CI",
    "Publicar no GHCR",
]


@require_GET
def health(request):
    """Endpoint simples de saude da API, consumido pelo frontend."""
    return JsonResponse({"status": "ok", "items": ITEMS})
