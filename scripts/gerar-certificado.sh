#!/bin/sh
# Gera o certificado autoassinado usado pelo Nginx na validacao local.
set -e
cd "$(dirname "$0")/.."
mkdir -p nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/selfsigned.key \
  -out nginx/certs/selfsigned.crt \
  -subj "/CN=localhost"
echo "Certificado gerado em nginx/certs/"
