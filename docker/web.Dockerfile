# -----------------------------------------------------------------------------
FROM node:16 as builder
# -----------------------------------------------------------------------------

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt install -y --no-install-recommends \
        google-chrome-stable \
        libxss1 \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

# Install dependencies
COPY tsconfig.json              ./
COPY yarn.lock package.json     ./
COPY patches/                   ./patches/
RUN yarn install

# Build app
COPY babel.config.js            ./
COPY build/                     ./build/
COPY src/                       ./src/
RUN --mount=type=secret,id=GIT_HASH \
    --mount=type=secret,id=GITHUB_PAT \
    yarn buildWeb

# -----------------------------------------------------------------------------
FROM nginx:alpine
LABEL org.opencontainers.image.source https://github.com/Trinovantes/template-spa-typescript-vue
# -----------------------------------------------------------------------------

WORKDIR /app

COPY ./docker/web.conf          /etc/nginx/conf.d/default.conf
COPY ./docker/general.conf      /app/general.conf
COPY --from=builder /app/dist   /app/dist

RUN nginx -t
