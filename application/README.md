# no1-company-share application

This application uses Nuxt 4, Vue 3, Vuetify 3, and an Express API mounted under `/api/`. The Nuxt source is in `front/`, the API is in `server/`, and shared code is in `common/`.

## Development and checks

Use Node 24 and Yarn Classic. Run these commands from `application/`:

```bash
yarn install --frozen-lockfile
yarn dev
yarn lint
yarn test
yarn build
yarn start
```

`yarn start` loads an existing `.env` and runs the Nitro server built in `.output/`. To run the real API write tests, set `NO1_TEST_DATABASE_URL` to a dedicated local PostgreSQL database whose name starts with `codex_no1_`, then run `yarn test:integration`. These tests write to that database. Do not point them at production or a shared development database.

The Firebase authentication tests use local fixtures. The service worker passes the current Firebase ID token with same-origin HTML navigation; the server verifies it before initial rendering. The client waits until the Nuxt app is mounted before subscribing to Firebase authentication changes. Only the latest authentication notification may update the store. After a user changes, personalized lists refresh and signed-out users return from bookmark and my-post pages to home.

## Development TLS dependency

Nuxt CLI and Nitro use a locally patched listhen to replace the vulnerable node-forge dependency. Its source, integrity check, update policy and HTTPS tests are documented in [vendor/listhen/README.md](vendor/listhen/README.md). When installing with `--ignore-scripts`, run `yarn prepare:tls` before any Nuxt command.

## API access limits

The bookmark, shared-post, user and development-user routes share a limit of 120 requests per minute per authenticated Firebase user. The limiter runs after token verification and before database access. Both `/api/v1` and its `/localhost` compatibility paths share the same counter. Excess requests receive HTTP 429 and a `Retry-After` header. The in-process counter resets on restart and is not shared between replicas.

Unauthenticated shared-post reads use the socket IP and do not trust forwarded headers. Anonymous clients behind a reverse proxy share one quota. For a production proxy, configure trust for only its actual addresses and use an ingress limiter or shared store for multiple replicas. Do not enable blanket `trust proxy` or derive the key from unverified headers. Authentication attempts and other endpoints need separate ingress protection.
