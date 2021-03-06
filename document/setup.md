`>git --version && node -v && docker -v`
git version 2.35.1.windows.2
v16.14.2
Docker version 20.10.13, build a224086

https://nuxtjs.org/docs/get-started/installation/
`yarn create nuxt-app no1-company-share`

```
create-nuxt-app v4.0.0
✨  Generating Nuxt.js project in no1-company-share
? Project name: no1-company-share
? Programming language: TypeScript
? Package manager: Yarn
? UI framework: Vuetify.js
? Nuxt.js modules: Axios - Promise based HTTP client
? Linting tools: ESLint, Prettier
? Testing framework: Jest
? Rendering mode: Universal (SSR / SSG)
? Deployment target: Server (Node.js hosting)
? Development tools: jsconfig.json (Recommended for VS Code if you're not using typescript)
? Continuous integration: GitHub Actions (GitHub only)
? What is your GitHub username? shin4488
? Version control system: Git
```

```
.babelrc
.editorconfig
.eslintrc.js
.github
.gitignore
.prettierignore
.prettierrc
assets
components
jest.config.js
jsconfig.json
layouts
node_modules
nuxt.config.js
package.json
pages
README.md
static
store
test
tsconfig.json
yarn.lock
```

`yarn dev`

```
yarn run v1.22.11
$ nuxt

i NuxtJS collects completely anonymous data about usage.                                                               17:32:13
  This will help us improve Nuxt developer experience over time.
  Read more on https://git.io/nuxt-telemetry

? Are you interested in participating? No


   ╭───────────────────────────────────────╮
   │                                       │
   │   Nuxt @ v2.15.8                      │
   │                                       │
   │   ▸ Environment: development          │
   │   ▸ Rendering:   server-side          │
   │   ▸ Target:      server               │
   │                                       │
   │   Listening: http://localhost:3000/   │
   │                                       │
   ╰───────────────────────────────────────╯


i Preparing project for development                                                                                    17:34:47
i Initial build may take a while                                                                                       17:34:47
i Discovered Components: .nuxt/components/readme.md                                                                    17:34:47
√ Builder initialized                                                                                                  17:34:47
√ Nuxt files generated                                                                                                 17:34:47

√ Client
  Compiled successfully in 13.36s

√ Server
  Compiled successfully in 11.83s

i Waiting for file changes                                                                                             17:35:04
i Memory usage: 328 MB (RSS: 506 MB)                                                                                   17:35:04
i Listening on: http://localhost:3000/                                                                                 17:35:04
No issues found.                                                                                                       17:35:04
» Updated pages\index.vue                                                                                              17:43:06

√ Client
  Compiled successfully in 609.70ms

√ Server
  Compiled successfully in 616.62ms

No issues found.
```

新しくgit cloneした後のディレクトリで
`yarn install`
`yarn dev`

## frontディレクトリの作成
https://nuxtjs.org/ja/docs/configuration-glossary/configuration-srcdir/#srcdir-%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3

```javascript
export default {
  srcDir: 'front',
  // その他の記述
}
```

```
.babelrc
.editorconfig
.eslintrc.js
.gitignore
.nuxt
.prettierignore
.prettierrc
.vscode
document
front
 ┣assets
 ┣components
 ┣layouts
 ┣pages
 ┣static
 ┣store
 ┗test
jest.config.js
jsconfig.json
LICENSE
node_modules
nuxt.config.js
package.json
README.md
tsconfig.json
workflows
yarn.lock
```

## serverMiddlewareの設定

https://nuxtjs.org/ja/docs/configuration-glossary/configuration-servermiddleware/
https://liginc.co.jp/438249

```
.babelrc
.editorconfig
.eslintrc.js
.gitignore
.nuxt
.prettierignore
.prettierrc
.vscode
document
front
 ┣assets
 ┣components
 ┣layouts
 ┣pages
 ┣static
 ┣store
 ┗test
server
 ┗index.ts
jest.config.js
jsconfig.json
LICENSE
node_modules
nuxt.config.js
package.json
README.md
tsconfig.json
workflows
yarn.lock
```

```javascript
export default {
  srcDir: './front',
  serverMiddleware: [
    '~~/server/',
  ],
}
```

```typescript
import express from 'express'

const app = express()
// リクエストボディがundefinedにならないようにする
app.use(express.json())
app.get('/api/v1/development', (req, res) => {
  res.send({ aaa: 123, bbb: 'abcdd' })
})

export default app
```

http://localhost:3000/api/v1/development
{"aaa":123,"bbb":"abcdd"}

## docker

https://docs.docker.jp/docker-for-windows/install.html

```
C:\>systeminfo
OS 名: Microsoft Windows 10 Pro
```

