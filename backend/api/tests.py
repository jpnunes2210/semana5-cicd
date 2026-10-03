from django.test import TestCase
from django.urls import reverse


class HealthEndpointTests(TestCase):
    def test_health_retorna_status_ok(self):
        response = self.client.get(reverse("health"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertEqual(response.json()["status"], "ok")

    def test_health_retorna_tres_itens(self):
        data = self.client.get(reverse("health")).json()
        self.assertEqual(
            data["items"],
            ["Configurar Docker", "Automatizar CI", "Publicar no GHCR"],
        )

    def test_health_aceita_apenas_get(self):
        response = self.client.post(reverse("health"))
        self.assertEqual(response.status_code, 405)
