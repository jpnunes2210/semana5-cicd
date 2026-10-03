# semana5-cicd

Aplicação desacoplada Django + Next.js + PostgreSQL + Nginx, containerizada para desenvolvimento e produção, com CI/CD no GitHub Actions.

Projeto do Laboratório AILAB Makers (UnB), Semanas 5 e 6.

## Estrutura

```
backend/    Django (config/ + app api/ com GET /api/health/)
frontend/   Next.js App Router (app/page.js consome a API)
nginx/      reverse proxy + TLS da stack de produção
```

## Rodando cada container isoladamente (Etapa 1)

```bash
# Backend com bind mount: editar backend/api/views.py recarrega o runserver
docker build -t s5-backend-dev ./backend
docker run --rm -p 8000:8000 -v "$(pwd)/backend:/app" s5-backend-dev

# Frontend com bind mount e hot reload (node_modules fica no volume anonimo)
docker build -t s5-frontend-dev ./frontend
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  -v "$(pwd)/frontend:/app" -v /app/node_modules \
  s5-frontend-dev
```

Sem `POSTGRES_HOST` definido o backend usa SQLite, então o `/api/health/` responde mesmo sem banco.

## Stack de desenvolvimento com Compose (Etapa 2)

```bash
cp .env.example .env          # credenciais locais, nunca versionadas
docker compose up --build     # db sobe primeiro; backend so inicia com o healthcheck verde
```

- Frontend: http://localhost:3000
- API: http://localhost:8000/api/health/
- Dados do PostgreSQL persistem no volume nomeado `postgres_data`

## CI (Etapa 3)

`.github/workflows/ci.yml` roda duas trilhas independentes, cada uma com fail-fast via `needs`:

| Trilha | Jobs | Ferramentas |
|---|---|---|
| Backend | `lint-backend` → `build-backend` → `test-backend` | Ruff, `docker build` + `manage.py check`, `manage.py test` com PostgreSQL de serviço |
| Frontend | `lint-frontend` → `build-frontend` → `test-frontend` | ESLint, `next build`, Vitest + Testing Library |

Cache: `cache: 'pip'` no `setup-python` e `cache: 'npm'` no `setup-node`.

Rodando localmente:

```bash
cd backend && pip install -r requirements-dev.txt && ruff check . && python manage.py test
cd frontend && npm ci && npm run lint && npm run build && npm test
```
