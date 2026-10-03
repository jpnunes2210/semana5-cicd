// Base da API. Vazio = caminho relativo (/api/...), usado em producao atras do Nginx.
// Em dev o navegador fala direto com o Django em http://localhost:8000.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchHealth(fetchImpl = fetch) {
  const response = await fetchImpl(`${API_URL}/api/health/`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API respondeu ${response.status}`);
  }
  const data = await response.json();
  if (data.status !== "ok" || !Array.isArray(data.items)) {
    throw new Error("Resposta da API fora do formato esperado");
  }
  return data;
}
