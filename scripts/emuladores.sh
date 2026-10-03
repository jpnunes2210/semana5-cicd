#!/bin/sh
# Gera o site apontando para o emulador e sobe Hosting + Firestore + UI.
#   Hosting:  http://localhost:5000
#   UI:       http://localhost:4000
# Os dados semente ficam em firebase/seed (importados ao subir, exportados ao sair).
set -e
cd "$(dirname "$0")/.."

(cd frontend && \
  STATIC_EXPORT=true \
  NEXT_PUBLIC_DATA_SOURCE=firestore \
  NEXT_PUBLIC_USE_EMULATOR=true \
  npx next build)

if [ -d firebase/seed ]; then
  exec firebase emulators:start --import=./firebase/seed --export-on-exit=./firebase/seed
else
  echo ">> Sem dados semente ainda. Em outro terminal rode: node scripts/seed-emulator.mjs"
  echo ">> Ao parar com Ctrl+C, os dados serao exportados para firebase/seed."
  exec firebase emulators:start --export-on-exit=./firebase/seed
fi
