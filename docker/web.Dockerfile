# -----------------------------------------------------------------------------
FROM ghcr.io/trinovantes/puppeteer-prerender-plugin as builder
# -----------------------------------------------------------------------------

WORKDIR /app

# Install dependencies
COPY tsconfig.json              ./
COPY yarn.lock package.json     ./
COPY node_modules               ./node_modules
COPY patches/                   ./patches/
RUN yarn install

# Build app
COPY build/                     ./build/
COPY src/                       ./src/
RUN --mount=type=secret,id=GIT_HASH \
    --mount=type=secret,id=GITHUB_PAT \
    --mount=type=secret,id=AWS_ENDPOINT_URL \
    --mount=type=secret,id=AWS_ACCESS_KEY_ID \
    --mount=type=secret,id=AWS_SECRET_ACCESS_KEY \
    yarn build

# -----------------------------------------------------------------------------
FROM caddy:2-alpine
LABEL org.opencontainers.image.source https://github.com/Trinovantes/template-spa-typescript-vue
# -----------------------------------------------------------------------------

WORKDIR /app

# Copy app
COPY ./docker/web.Caddyfile     /etc/caddy/Caddyfile
COPY --from=builder /app/dist   /app/dist/
