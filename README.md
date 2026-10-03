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

## Imagens de produção (Etapa 4)

```bash
docker build -f backend/Dockerfile.prod  -t s5-backend:prod  ./backend
docker build -f frontend/Dockerfile.prod -t s5-frontend:prod ./frontend
docker images | grep s5-                 # frontend precisa ficar abaixo de 150 MB
docker run --rm s5-frontend:prod whoami  # nextjs
docker run --rm --entrypoint whoami s5-backend:prod  # django
```

- Backend: multi-stage em `python:3.12-alpine`, venv copiado do builder, Gunicorn, WhiteNoise para os estáticos do admin, usuário `django` (uid 1001).
- Frontend: estágios `deps` → `builder` → `runner`, `output: 'standalone'`, runner copia só `.next/standalone`, `.next/static` e `public`, usuário `nextjs`.

## Stack de produção com Nginx e SSL (Etapa 5)

```bash
./scripts/gerar-certificado.sh               # certificado autoassinado (CN=localhost)
cp .env.prod.example .env.prod               # senhas reais, fora do Git
docker compose -f docker-compose-prod.yml up -d --build

curl -I  http://localhost/                   # 301 -> https://localhost/
curl -k  https://localhost/api/health/       # JSON vindo do Django via Nginx
curl -kI https://localhost/                  # 200 do Next.js via Nginx
```

Só o `nginx` publica portas (80 e 443). `backend:8000`, `frontend:3000` e `db:5432` existem apenas na rede `internal`.

| Rota | Destino |
|---|---|
| `/api/`, `/admin/`, `/static/` | `backend:8000` (Gunicorn) |
| `/` | `frontend:3000` (Next.js standalone) |

## Deploy contínuo no GHCR (Etapa 6)

Em todo push na `main`, depois que a trilha correspondente passa:

| Job | Depende de | Publica |
|---|---|---|
| `deploy-backend` | `test-backend` | `ghcr.io/<usuario>/<repo>-backend:latest` e `:<sha>` |
| `deploy-frontend` | `test-frontend` | `ghcr.io/<usuario>/<repo>-frontend:latest` e `:<sha>` |

Autenticação pelo `GITHUB_TOKEN` do próprio workflow, com `permissions: contents: read, packages: write`. Nenhum segredo extra é necessário.

```bash
docker pull ghcr.io/<usuario>/<repo>-backend:latest
docker pull ghcr.io/<usuario>/<repo>-frontend:latest
```

---

# Semana 6: do container à nuvem (Firebase, custo zero)

A Semana 5 continua intacta. O frontend passa a ter também um modo de **export estático** publicado no Firebase Hosting, com dados no Cloud Firestore, tudo no plano **Spark** (sem cartão).

## Projeto Firebase e CLI (Etapa 1)

```bash
npm install -g firebase-tools
firebase login
./scripts/configurar-projeto.sh <id-do-seu-projeto>   # troca o ID de exemplo semana6-jpnunes
firebase projects:list
```

Arquivos versionados: `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`. Logs do Firebase, `.firebase/` e qualquer JSON de conta de serviço estão no `.gitignore`.

## Deploy mais rápido (Etapa 2)

O modo de saída do Next.js é escolhido pela variável `STATIC_EXPORT`:

| Comando | Saída | Usado por |
|---|---|---|
| `npm run build` | `.next/standalone` | `Dockerfile.prod` (Semana 5) |
| `npm run build:static` | `out/` (HTML estático) | Firebase Hosting (Semana 6) |

```bash
cd frontend && npm run build:static && cd ..
firebase deploy --only hosting
curl -I https://<id-do-projeto>.web.app       # HTTP/2 200
```

Sem backend na nuvem, `/api/health/` não existe no Hosting e a página mostra "Dados indisponíveis" em vez de tela branca.

## Emulator Suite (Etapa 3)

Pré-requisito: Java (JDK 11 ou mais novo), exigido pelo emulador do Firestore.

```bash
./scripts/emuladores.sh                  # build apontando pro emulador + Hosting, Firestore e UI
node scripts/seed-emulator.mjs           # (1a vez, em outro terminal) cadastra os 3 itens
# Ctrl+C no primeiro terminal exporta os dados para firebase/seed (versione essa pasta)
```

- Página: http://localhost:5000 (lista os itens do emulador)
- UI: http://localhost:4000 (aba Firestore > Requests mostra leitura permitida e escrita negada)
- Botão "Testar escrita no Firestore" na página: deve mostrar `Bloqueado: permission-denied`

Fonte de dados do frontend, sem mudar a tela:

| Variável | Valores |
|---|---|
| `NEXT_PUBLIC_DATA_SOURCE` | `api` (Django) ou `firestore` |
| `NEXT_PUBLIC_USE_EMULATOR` | `true` conecta no emulador com `connectFirestoreEmulator` |

Testes automatizados das regras:

```bash
firebase emulators:exec --only firestore "npm --prefix frontend run test:rules"
```

## Firestore de produção, Versão B e rollback (Etapa 4)

1. Console do Firebase > Firestore Database > Criar banco no **modo de produção** (plano Spark).
2. Cole a config web do app em `frontend/lib/firebase-config.js` (ela é pública por design).
3. Publique as regras e cadastre os 3 itens pelo console (coleção `items`, campos `texto` string e `ordem` número):
   ```bash
   firebase deploy --only firestore:rules
   ```
4. Produção e Versão B no ar ao mesmo tempo:
   ```bash
   ./scripts/deploy-producao.sh     # https://<id>.web.app (canal live)
   ./scripts/deploy-versao-b.sh     # https://<id>--versao-b-<hash>.web.app (expira em 7 dias)
   ```
5. Rollback: console > Hosting > Histórico de versões > na versão anterior, menu ⋮ > Reverter.
6. Na página publicada, o botão "Testar escrita no Firestore" deve responder `Bloqueado: permission-denied`.
