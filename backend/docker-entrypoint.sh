#!/bin/sh
# Aplica migracoes antes de subir o servidor (desligue com RUN_MIGRATIONS=false)
set -e

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  python manage.py migrate --noinput
fi

exec "$@"
