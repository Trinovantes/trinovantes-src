# -----------------------------------------------------------------------------
FROM ghcr.io/trinovantes/puppeteer-prerender-plugin AS builder
# -----------------------------------------------------------------------------

RUN npm install -g pnpm@12

WORKDIR /app

COPY tsconfig.json              ./
COPY package.json               ./
COPY pnpm-workspace.yaml        ./
COPY pnpm-lock.yaml             ./
COPY patches/                   ./patches/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install \
        --frozen-lockfile

# Build app
COPY build/                     ./build/
COPY src/                       ./src/
RUN --mount=type=secret,id=GIT_HASH \
    --mount=type=secret,id=GITHUB_PAT \
    --mount=type=secret,id=AWS_ENDPOINT_URL \
    --mount=type=secret,id=AWS_ACCESS_KEY_ID \
    --mount=type=secret,id=AWS_SECRET_ACCESS_KEY \
    pnpm build

# -----------------------------------------------------------------------------
FROM caddy:2-alpine
LABEL org.opencontainers.image.source=https://github.com/Trinovantes/template-spa-typescript-vue
# -----------------------------------------------------------------------------

WORKDIR /app

# Copy app
COPY --from=builder /app/dist/          ./dist/
COPY ./docker/web.Caddyfile             /etc/caddy/Caddyfile

RUN caddy validate --config /etc/caddy/Caddyfile \
    && caddy fmt --overwrite /etc/caddy/Caddyfile
