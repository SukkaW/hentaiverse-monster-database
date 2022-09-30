# HentaiVerse Monster Database

> M-M-M-MONSTER DATABASE!

https://hv-monster.skk.moe

HentaiVerse Monster Database is a community-built project for indexing player-created monsters in a pure text online RPG game, HentaiVerse.

## Introduction

The first HentaiVerse Monster Database was created by a player (Jenga) years ago. It is then operated and maintained by another player (decondelite). It was also integrated into the commonly used enhancing script *Monsterbation* to show the monster's details during the battle. The database server and the website stops operating at the end of 2020.

The second HentaiVerse Monster Database was created by another player (zhenterzzf) in 2021. I help to create the new website that features data grid and chart, as well as the dedicated monster database userscript. The server stopped operating months later.

After the second HentaiVerse Monster Database stopped operating, I start to rebuild a new monster database project from scratch, while matains the backward compatibility with Jenga and zhenterzzf's database.

## Design Principles

- Open Source: Since the project is open-sourced, other players from the community can revive it if I get hit by a bus. It also allows the entire community to audit and inspects the implementation details.
- Serverless: Operating a server could be expensive, the SLA can not be guaranteed, and also hard to maintain. With the serverless platform, we can just deploy, then forget.
- Minimizing the cost: HentaiVerse Monster Database is designed to utilize the existing free tire/quota of the PaaS/IaaS platform.

  > Currently, the website is hosted on [Cloudflare Pages](https://pages.cloudflare.com) and can be easily migrated to other static hosting platforms within minutes. The backend server is deployed on the [Vercel](https://vercel.com) and can switch to any other serverless platforms or a VPS. The data is stored in a serverless database platform [Deta](https://deta.sh) and can be easily migrated to other platforms or a self-hosted database within hours. The database dump and archive are powered by [GitHub Action](https://github.com/features/actions), and the data is stored and hosted on the [GitHub Pages](https://pages.github.com), which can easily be migrated to other git platforms, CI, and static hosting. The total cost of running the project can be reduced to $0.

## Architecture

HentaiVerse Monster Database uses the monorepo approach to manage multiple projects that are using multiple frameworks, in a single, unified code repository. The monorepo contains the following sub-packages:

- [`/packages/web`](./packages/web/): The front-end of the HentaiVerse Monster Database where you can view and search through the data
- [`/packages/server`](./packages/server/): The actual server that receives monster scan results, validates, and stores into the database
- [`/packages/data`](./packages/data/): The script that will dump the database into JSON files, and upload them to the GitHub repository on a daily basis
- [`/packages/api-server-on-vercel`](/packages/api-server-on-vercel/): Deploy the server to the [Vercel](https://vercel.com), a serverless platform
- [`/packages/types`](/packages/types/): The type definition of the data structure

### Website (web)

Also known as the https://hv-monster.skk.moe. The website downloads the data from another domain, `hv-monsterdb-data.skk.moe` (which I will explain later), and render the data grid and charts in the browser. It is hosted on the [Cloudflare Pages](https://pages.cloudflare.com) for free.

[`/packages/web`](./packages/web/) holds the source code of the website. It is a static website built with [React](https://reactjs.org), [TailwindCSS](https://tailwindcss.com), [SWR](https://swr.vercel.app), [Grid.js](https://gridjs.io/) and [ECharts](https://echarts.apache.org/en/index.html).

The project uses [Parcel](https://parceljs.org) to build and bundle the dist.

### Backend (server)

[`/packages/server`](./packages/server/) holds the source code of the server that receives the scan results from the player. It is a [Node.js](https://nodejs.org/en/) application that uses [Fastify](https://www.fastify.io) as the server framework.

The data is stored in a free serverless database platform [Deta](https://deta.sh). However, the server is implemented so that you can easily switch to another database provider or bring up your own database, by writing and applying your "adapter". As long as your "adapter" exposes the following methods, you can connect the server with any database:

```ts
export type GetMonsterUsingId = (monsterId: number, isIsekai: boolean) => Promise<MonsterInfo>;
export type UpdateMonster = (data: MonsterInfo, isIsekai: boolean) => Promise<void>;

export const getMonsterUsingId: GetMonsterUsingId;
export const updateMonster: UpdateMonster;
```

### Backend on the Vercel (api-server-on-vercel)

[`/packages/api-server-on-vercel`](/packages/api-server-on-vercel/) holds the source code of `https://hv-monster-submit.skk.moe/`. It deploys the backend to the [Vercel](https://vercel.com) serverless platform with the hobby plan (free).

### Data Dump and Archive (data)

[`/packages/data`](/packages/data/) contains two scripts: The original script that is used to import the data from the original database into the [Deta](https://deta.sh) serverless database platform. And another script is used to dump and download the entire database to a JSON file from the Deta.

The project uses [GitHub Actions](https://github.com/features/actions)' cron feature to dump the database on UTC 23:00 on a daily basis. The JSON files are then uploaded to another GitHub repository [SukkaLab/hv-monster-data](https://github.com/SukkaLab/hv-monster-data), which is eventually deployed to https://hv-monsterdb-data.skk.moe (Hosted on [GitHub Pages](https://pages.github.com/) for free).

You can download the latest full database dump at:

- Persistent: https://hv-monsterdb-data.skk.moe/persistent.json
- Isekai: https://hv-monsterdb-data.skk.moe/isekai.json

> When using the hentaiverse monster database userscript, players will also download the full database from the URLs above to update their browsers' IndexedDB. Separating the data dump hosting also reduces the load of the database.

The GitHub repository also serves the purpose of backup and archive.

### Userscript

The HentaiVerse player can install a userscript to improve the user experience of the project. The userscript is hosted in a dedicated GitHub repository [SukkaW/hv-monsterdb-userscript](https://github.com/SukkaW/hv-monsterdb-userscript). It is built with [Million Virtual DOM](https://millionjs.org) and [nanostore](https://github.com/nanostore/nanostore).

The script will update the local database from `https://hv-monsterdb-data.skk.moe` once per day, typically at the Dawn of a New Day event out of the battle. During the battle, the script will automatically show monster information on the page. All information comes from the local database, with no request to the server involved. Every time the player scan a monster, the script will automatically parse Battle Log, update the local database, and send the scan result to the submit endpoint. The userscript also exposes [a set of APIs](https://suka.js.org/hv-monsterdb-userscript/) to work with other HentaiVerse userscripts.

## Build, Deploy or Contribute

First of all, you should have [Node.js](https://nodejs.org) and [Git](https://git-scm.com) installed. Run the following command to check their existence:

```sh
$ node -v
$ git -v
```

Install the [pnpm](https://pnpm.io) (fast, disk space efficient package manager):

```sh
$ npm i pnpm -g
// You can also use a standalone installation script for installing pnpm:
// curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Build

Clone the repository from GitHub to your local machine:

```sh
$ git clone https://github.com/sukkaw/hentaiverse-monster-database.git
$ cd hentaiverse-monster-database
```

Install the dependencies:

```sh
$ pnpm i
```

Build the entire project:

```sh
$ pnpm run build
// You can also build a specific package:
// pnpm run build --filter=[web/server/etc.]
```

You will find the emitted outputs are located under the `packages/[package-name]/dist` folder.

### Deploy

#### Website

After you build the project, you can find the ready-to-deploy website assets in the `packages/web/dist` folder. You can deploy the dist to any static website hosting platform, such as [Netlify](https://www.netlify.com), [Vercel](https://vercel.com), [Cloudflare Pages](https://pages.cloudflare.com), [GitHub Pages](https://pages.github.com), etc. You can also just upload the content of the `dist` folder to your own server.

#### Backend Server

You can find the server entrypoint at the `packages/server/dist/index.js`. This is just a demo example server that can be started with the following command:

```sh
$ node packages/server/dist/index.js
```

The default port is 3000, but you can also specify any port using the `PORT` environment variable:

```sh
$ PORT=3000 node packages/server/dist/index.js
```

However, it is recommended to build your own server based on the source code of the entrypoint (`packages/server/src/index.ts`) which you can use more features like rate-limiting and logging.

Also, it is recommended to use a reverse proxy (Nginx, HAproxy, varnish) in front of the backend server when deploying to production. You should also use the Node.js cluster and a process manager (E.g. pm2) to improve the performance and maintain scalability.

#### Serverless Platform

You can also deploy the backend server to the serverless platform. The source code code at the `packages/api-server-on-vercel` folder is ready to deploy on Vercel, while you can also follow [Serverless - Fastify Docs](https://www.fastify.io/docs/latest/Guides/Serverless/) to deploy the backend server to other serverless platforms.

### Contribute

The project is written in [TypeScript](https://www.typescriptlang.org), and uses [ESLint](https://eslint.org) to enforce the code style and quality.

## License

[GPL-3.0](./LICENSE)

----

**HentaiVerse Monster Database** © [Sukka](https://github.com/SukkaW), Released under the [GPL-3.0](./LICENSE) License.
Authored and maintained by Sukka with help from contributors ([list](https://github.com/SukkaW/hentaiverse-monster-database/network/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Twitter [@isukkaw](https://twitter.com/isukkaw) · Keybase [@sukka](https://keybase.io/sukka)
