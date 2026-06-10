# E-commerce Test Automation Framework

A test automation framework built with **Playwright + TypeScript** for the
[Automation Exercise](https://automationexercise.com) e-commerce site. It
demonstrates a clean, maintainable framework design: Page Object Model,
dependency-injected fixtures, centralized configuration, structured logging,
and multi-format reporting.

> **Why this site?** The branded sites listed in the challenge sit behind Akamai
> bot protection that returns *Access Denied* to automated traffic. Rather than
> fight anti-bot measures (out of scope for demonstrating framework design), I
> targeted a full-featured e-commerce site purpose-built for automation, which
> exposes stable `data-qa` test hooks and permits the complete journey including
> account creation. The framework is **site-agnostic** — point `BASE_URL` at any
> store to retarget. This is itself a deliberate QA decision: choose a stable,
> automatable target so the suite is reliable and deterministic.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Project structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Setup & installation](#setup--installation)
5. [Configuration](#configuration)
6. [Running the tests](#running-the-tests)
7. [Reports](#reports)
8. [Logging](#logging)
9. [Test scope & QA rationale](#test-scope--qa-rationale)
10. [Design decisions](#design-decisions)
11. [Continuous integration](#continuous-integration)

---

## Tech stack

| Concern          | Choice                                  | Why                                              |
| ---------------- | --------------------------------------- | ------------------------------------------------ |
| Test runner      | `@playwright/test`                      | Fast, parallel, auto-waiting, first-class TS     |
| Language         | TypeScript (strict)                     | Type safety surfaces bugs before runtime         |
| Logging          | `winston`                               | Structured console + file logs                   |
| Test data        | `@faker-js/faker`                       | Unique, independent data per run                 |
| Config           | `dotenv`                                | 12-factor style config via environment variables |
| Lint / format    | ESLint (flat config) + Prettier         | Enforced, consistent code quality                |
| Reporting        | Playwright HTML + JSON + JUnit + custom | Human + machine + CI-friendly outputs            |

---

## Project structure

```
ecommerce-automation-framework/
├── src/
│   ├── config/
│   │   ├── env.config.ts          # Typed, env-driven configuration (single source of truth)
│   │   └── routes.ts              # Centralized URL paths
│   ├── data/
│   │   ├── test-data.ts           # Faker-based generators + shared search terms
│   │   └── users.ts               # Static invalid creds for the negative login test
│   ├── fixtures/
│   │   └── pages.fixture.ts       # Custom `test` injecting page objects + ad-network blocking
│   ├── pages/
│   │   ├── base.page.ts           # Abstract base: shared nav, components, helpers
│   │   ├── components/
│   │   │   ├── cookie-consent.component.ts
│   │   │   └── header.component.ts
│   │   ├── home.page.ts
│   │   ├── products.page.ts       # Listing: search, grid, add-to-cart, view product
│   │   ├── product.page.ts        # Product details page (PDP)
│   │   ├── cart.page.ts
│   │   ├── login.page.ts
│   │   └── registration.page.ts   # Two-step signup journey
│   ├── reporters/
│   │   └── logging-reporter.ts    # Custom reporter → winston summary
│   └── utils/
│       └── logger.ts              # Winston logger (console + files)
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── registration.spec.ts
│   ├── catalog/
│   │   ├── search.spec.ts
│   │   └── product-details.spec.ts
│   └── cart/
│       └── add-to-cart.spec.ts
├── .github/workflows/playwright.yml  # CI pipeline
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── .env.example
└── README.md
```

---

## Prerequisites

- **Node.js 18+** (developed on Node 22)
- **npm** (ships with Node)

---

## Setup & installation

```bash
# 1. Install dependencies
npm install

# 2. Install the Playwright browser binaries (Chromium is enough for the defaults)
npx playwright install chromium

# 3. (Optional) create your local env file
cp .env.example .env
```

The framework runs out of the box with no `.env` edits required.

---

## Configuration

All runtime settings live in `src/config/env.config.ts` and are driven by
environment variables (loaded from `.env`). Every value has a sensible default.

| Variable             | Default                          | Description                                   |
| -------------------- | -------------------------------- | --------------------------------------------- |
| `TEST_ENV`           | `prod`                           | Selects a base URL from the env→URL map       |
| `BASE_URL`           | `https://automationexercise.com` | Override the target site directly             |
| `HEADLESS`           | `true`                           | Run browsers headless (`false` to watch)      |
| `SLOW_MO`            | `0`                              | Delay (ms) between actions for debugging      |
| `TEST_USER_EMAIL`    | _(empty)_                        | Account email for the login happy-path test   |
| `TEST_USER_PASSWORD` | _(empty)_                        | Account password for the login happy-path test|
| `LOG_LEVEL`          | `info`                           | `error` \| `warn` \| `info` \| `debug`        |

---

## Running the tests

```bash
npm test                 # Run the whole suite (headless, Chromium)
npm run test:headed      # Run with a visible browser
npm run test:ui          # Open Playwright's interactive UI mode
npm run test:debug       # Step-through debugging

# By area
npm run test:auth        # Authentication (login + registration)
npm run test:catalog     # Search + product details
npm run test:cart        # Add to cart

# Quality gates
npm run typecheck        # tsc --noEmit
npm run lint             # ESLint
npm run format           # Prettier (write)
```

Filter to a single test as usual: `npx playwright test -g "narrows the catalogue"`.

---

## Reports

Three report formats are generated on every run (configured in
`playwright.config.ts`):

| Format         | Location              | Use                                       |
| -------------- | --------------------- | ----------------------------------------- |
| **HTML**       | `reports/html/`       | Rich, interactive — traces & screenshots  |
| **JSON**       | `reports/results.json`| Machine-readable for dashboards/pipelines |
| **JUnit XML**  | `reports/junit.xml`   | Consumed by CI (GitHub Actions, Jenkins…) |

Open the HTML report after a run:

```bash
npm run report
```

On failure, the framework captures a **trace**, **screenshot**, and **video**
(see `use` in `playwright.config.ts`), all viewable inline in the HTML report.

---

## Logging

Structured logging is provided by **winston** (`src/utils/logger.ts`):

- **Console** — colourised, level-controlled via `LOG_LEVEL`.
- `logs/test-run.log` — full run log.
- `logs/error.log` — errors only, for fast triage.

Logging operates at two levels: page objects log each action (the log reads like
the user journey), and a **custom Playwright reporter**
(`src/reporters/logging-reporter.ts`) writes a concise PASS/FAIL/SKIP summary
into the same logs — one greppable execution record alongside the HTML report.

---

## Test scope & QA rationale

The challenge asks for the _most critical_ flows, not the most tests. I chose
the **revenue-critical discovery-to-conversion funnel** plus **account access**,
because together they cover the journey that drives sales and the gate that
protects customer accounts.

| Flow                     | Test(s)                                      | Why it's critical                                                            |
| ------------------------ | -------------------------------------------- | ---------------------------------------------------------------------------- |
| **Catalogue search**     | results for a common term; search narrows the list | Search is the main discovery path; broken search kills conversion everywhere |
| **Product details page** | core info (name + price) renders             | The page where the buying decision is made                                   |
| **Add to cart**          | add from listing, verify it persists in cart | The key pre-checkout conversion event; chains the whole funnel               |
| **Login**                | reject invalid creds; (conditional) valid sign-in | Account access + the most security-relevant behaviour                        |
| **Registration**         | full end-to-end account creation             | Top of the retention funnel; a broken signup blocks all new shoppers         |

**7 tests across 5 files.** Deliberate trade-offs worth calling out:

- **Negative coverage where it's cheap and high-value.** The invalid-login test
  needs no special data, is deterministic, and guards the behaviour most likely
  to regress quietly — that wrong credentials never get in.
- **Conditional happy-path login.** A real sign-in needs a real account, so that
  test **self-skips** unless credentials are supplied via `.env`, keeping the
  default run green for any reviewer.
- **Registration runs full end-to-end here — on purpose.** Automation Exercise
  is a dedicated test environment that permits account creation, so we register
  a fresh, uniquely-generated user and assert "Account Created!". Against a
  production retail site this is exactly the test you would *not* run blindly
  (real accounts, email verification, bot protection); running it here
  demonstrates understanding of the **test-vs-production environment**
  distinction.
- **Stability over an ad-supported page.** Third-party ad/analytics networks are
  blocked at the network layer (`src/fixtures/pages.fixture.ts`) to remove
  overlays and flakiness — a realistic technique for ad-heavy targets.

---

## Design decisions

- **Page Object Model.** Every page is a class; selectors and behaviour live in
  one place. Tests read as user intent, not DOM mechanics.
- **Stable, semantic locators.** Where the site provides `data-qa` hooks
  (login/signup) we use them — they're the most resilient anchors available.
  Elsewhere we prefer roles/text and the site's stable `id`s.
- **Components for shared UI.** The header/navigation and consent banner are
  modelled as reusable components rather than copied into each page object.
- **Fixtures over a god base-class.** Page objects are injected into tests via a
  custom `test` (`src/fixtures/pages.fixture.ts`). Tests declare only what they
  need; no `new XxxPage(page)` boilerplate. This is the idiomatic Playwright POM.
- **Centralized, typed config.** `env.config.ts` is the single source of truth;
  switching environments or stores is an env-var change, never a code change.
- **Diagnostics on failure.** Trace + screenshot + video are retained on
  failure/retry for fast root-causing.

---

## Continuous integration

`.github/workflows/playwright.yml` runs the suite on push/PR to `main`, on a
daily schedule, and on manual dispatch. It installs dependencies and Chromium,
runs the suite with CI retries, and uploads the HTML report and execution logs
as build artifacts (14-day retention). Configure `TEST_USER_EMAIL` /
`TEST_USER_PASSWORD` as repository secrets to enable the login happy-path test.
