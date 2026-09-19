# no1-company-share

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Dependency checks

Use the Node.js version specified in `package.json` and install dependencies with `yarn install --frozen-lockfile`. After updating dependencies, run `yarn lint`, `yarn test`, and `yarn build`. To run only the dependency security and compatibility checks, use `yarn test:dependencies`.

When using `resolutions`, verify compatibility with the packages that depend on them. Remove overrides once the parent packages support patched versions.

## API access limits

The bookmark, shared-post, user and development-user routes share a limit of 120 requests per minute per authenticated Firebase user. The limiter runs after token verification and before database access. Both `/api/v1` and its `/localhost` compatibility paths share the same counter. Excess requests receive HTTP 429 and a `Retry-After` header. The in-process counter resets on restart and is not shared between replicas.

Unauthenticated shared-post reads use the socket IP and do not trust forwarded headers. Anonymous clients behind a reverse proxy share one quota. For a production proxy, configure trust for only its actual addresses and use an ingress limiter or shared store for multiple replicas. Do not enable blanket `trust proxy` or derive the key from unverified headers. Authentication attempts and other endpoints need separate ingress protection.

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
