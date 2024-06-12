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
- [ ] User Dashboard
- [ ] User Settings
    - [ ] Subscription Info
    - [ ] Personal Info
- [x] User Saved Papers List
    - [ ] Add papers to user
    - [ ] Add ability to organize papers into folders
- [ ] Home Page
    - [ ] Subject Categories
    - [ ] Trending Feed
    - [x] Recent Feed
    - [ ] Sidebar Functionality
        - [ ] Search
        - [ ] Filter
        - [ ] Keywords
- [x] Article Detail
    - [ ] Comments
- [x] Fetch Recent Arxiv Papers
- [x] Fetch Single Arxiv Paper
    - [x] Arxiv API
    - [x] PDF image thumbnails
- [x] OpenAI Sparknotes
    - [x] Prompt Engineering
    - [x] PDF RAG
        - [x] Experiment in the future with foundational RAG context (e.g. a collection of textbooks on machine learning/math).
    - [x] Extract Keywords
    - [x] Extract Analysis
- [ ] SAAS
    - [ ] Stripe Integration