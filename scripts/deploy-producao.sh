#!/bin/sh
# Build estatico lendo do Firestore de PRODUCAO e publicacao no canal live.
set -e
cd "$(dirname "$0")/.."
(cd frontend && STATIC_EXPORT=true NEXT_PUBLIC_DATA_SOURCE=firestore npx next build)
firebase deploy --only hosting
