#!/bin/sh
# Versao B num canal de pre-visualizacao que expira em 7 dias.
# A producao (canal live) continua no ar com a versao A.
set -e
cd "$(dirname "$0")/.."
(cd frontend && STATIC_EXPORT=true NEXT_PUBLIC_DATA_SOURCE=firestore NEXT_PUBLIC_APP_VARIANT=b npx next build)
firebase hosting:channel:deploy versao-b --expires 7d
