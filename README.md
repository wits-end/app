# Wits End

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Todo

- [x] User Auth
- [x] User Dashboard
    - [x] Save Articles
    - [x] Embedding Fingerprint
- [x] User Settings
    - [x] Personal Info
- [x] Home Page
    - [x] Subject Categories
    - [x] Recent Feed
    - [x] Featured Feed
        - [x] Sort by author prestige + citations + recency
    - [x] Influential Feed
        - [x] Sort by citations
    - [x] For You Feed
    - [x] Sidebar Filters
        - [x] Search
        - [x] Sort
        - [x] Tags
- [x] Paper feeds
    - [x] Add/remove papers to user
- [x] Article Detail
    - [x] Sparknotes
        - [x] Prompt Engineering
        - [x] PDF RAG
            - [x] Experiment with foundational RAG context (e.g. a collection of textbooks on machine learning/math)
        - [x] Synopsis
        - [x] Peronsal notes
    - [ ] Report

- [ ] Premium
    - [ ] Marketing Page
    - [x] Setup Stripe
    - [x] No Ads
    - [x] Custom reading lists
        - [x] DB setup
        - [x] Lexorank
        - [x] Drag n Drop
        - [x] New lists
    - [x] Personal notebooks
        - [x] Article detail
        - [x] Markdown editor
        - [x] Admin management