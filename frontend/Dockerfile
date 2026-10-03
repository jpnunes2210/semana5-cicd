# Imagem de DESENVOLVIMENTO do frontend (next dev com hot reload)
FROM node:20-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    WATCHPACK_POLLING=true

COPY package.json package-lock.json ./
RUN npm ci

# Em dev o codigo vem do bind mount; node_modules fica no volume anonimo do container
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]
