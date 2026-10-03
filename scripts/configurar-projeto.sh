#!/bin/sh
# Troca o ID de projeto Firebase de exemplo pelo seu em todos os arquivos.
# Uso: ./scripts/configurar-projeto.sh meu-projeto-id
set -e
cd "$(dirname "$0")/.."

NOVO="$1"
ANTIGO="semana6-jpnunes"

if [ -z "$NOVO" ]; then
  echo "Uso: $0 <id-do-projeto-firebase>" >&2
  exit 1
fi

ANTIGO_SECRET=$(echo "$ANTIGO" | tr 'a-z-' 'A-Z_')
NOVO_SECRET=$(echo "$NOVO" | tr 'a-z-' 'A-Z_')

for f in $(grep -rlE "$ANTIGO|$ANTIGO_SECRET" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=out . || true); do
  sed -i.bak -e "s/$ANTIGO_SECRET/$NOVO_SECRET/g" -e "s/$ANTIGO/$NOVO/g" "$f" && rm -f "$f.bak"
  echo "atualizado: $f"
done
