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

## Dependency security checks

Use Node 24 and `yarn install --frozen-lockfile`. `yarn test` runs the dependency
security checks followed by the application tests; `yarn test:dependencies` runs
only the dependency checks. Run `yarn lint` and `yarn build` before changing the
security resolutions in `package.json`.

Nuxt 2 and its tools still request vulnerable dependency versions. The resolutions
keep the existing framework while selecting these patched packages:

| Dependency             | Used by                              | Compatibility checks                                                                                                     |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `serialize-javascript` | Vue SSR, Nuxt, Terser                | SSR state escaping, dates/regular expressions/functions, rejection of injected code, production build; requires Node 20+ |
| `tar`                  | `cacache` used by Nuxt's Terser      | Archive creation/extraction and cache read/write; cacache 15 declares tar but does not import it in its runtime code     |
| `tmp`                  | `external-editor` via Nuxt telemetry | Temporary file creation, contents, permissions and cleanup                                                               |
| `cookie`               | `@nuxtjs/youch`                      | Cookie parsing and rejection of invalid cookie names                                                                     |

These resolutions intentionally exceed the old parents' requested ranges, so Yarn
prints compatibility warnings. Keep the tests when updating them; remove the
resolutions when the parent packages support patched versions themselves.

This does not resolve all advisories. Nuxt 2/Vue 2/Vuetify 2 and their older build
dependencies still require a framework migration. Firebase dependencies also
retain advisories requiring upstream changes. Do not replace those dependencies
across incompatible major versions solely to silence audit results.

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
