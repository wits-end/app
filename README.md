# Wits End

![]()

Wits End is a platform for AI and ML researchers to better explore the research landscape. We have gathered a curated collection of the best papers in machine learning to help you explore the most important ideas and projects in this field. We perform high quality AI analysis on these papers to produce synopses that make it easier to quickly view the key ideas and results. Create an account to save articles. Premium members get access to additional features including: personalized paper recommendations, custom reading lists, editable markdown notes, early access to new features, and an ad-free experience. Our purpose is to build a useful tool that new and experienced ML researchers will love to use in order to discover, explore, and organize their academic literature.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

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
    - [ ] Share
- [ ] Email Server Setup

- [ ] Premium
    - [ ] Marketing Page
        - [ ] Explainer video/animation
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