# Basis-Image mit Multi-Stage Build
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

# System-Abhängigkeiten
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    g++ \
    make \
    python3 \
    vips-dev \
    git \
    sqlite \
    sqlite-dev \
    bash

# Arbeitsverzeichnis
WORKDIR /opt/app

# NPM-Cache optimieren
COPY package.json package-lock.json ./

# Systemarchitektur ermitteln
RUN export ARCH=$(uname -m)

# NPM-Konfiguration für Architektur-spezifische Kompilierung
RUN npm_config_arch=$(uname -m) npm ci better-sqlite3 --build-from-source

# Restliche Abhängigkeiten
RUN npm ci --legacy-peer-deps

# App kopieren und bauen
COPY . .
RUN npm run build

# Produktions-Stage
FROM --platform=$BUILDPLATFORM node:18-alpine

# Notwendige Systemabhängigkeiten
RUN apk add --no-cache vips-dev sqlite build-base gcc g++ python3

# Arbeitsverzeichnis
WORKDIR /opt/app

# Kopiere Build-Artefakte vom Builder
COPY --from=builder /opt/app ./

# Rechte setzen
RUN chown -R node:node /opt/app
USER node

# Rebuild better-sqlite3 für Produktionsimage
RUN npm_config_arch=$(uname -m) npm rebuild better-sqlite3 --build-from-source

# Ports und Health Check
EXPOSE 1337

# Entwicklungs- und Produktionsmodus
CMD ["npm", "run", "develop"]