# Amazon Clone — Resume Project Plan (Express + React/Vite + MongoDB)

## How to use this file with your coding agent

1. Paste this whole file into your agent's context (or keep it in the repo root and reference it).
2. Tell the agent: **"We are on Step X.Y. Do ONLY this step, and change the minimum number of files needed for it. After doing it, explain what you wrote, file by file, and why. Then stop and wait for me before continuing."**
3. After each step: read the diff, ask questions until you actually understand it, then say "continue to next step."
4. Commit after every step (`git commit -m "step X.Y: ..."`). Small, explainable commits = interview material.
5. If a step feels too big when the agent starts working, stop it and ask it to break that step down further before continuing — don't let it silently do multiple steps at once.
6. Anything genuinely new to you (Redis, Docker, Zod, rate limiting, logging, Swagger) — ask the agent to explain the *concept* in plain terms before it writes any code for that step, not just narrate the code after.

Timeline target: roughly 16–17 days now that Redis, Docker, logging, rate limiting, Zod, and Swagger are folded in. Treat Phase 10 (Docker) and the very end of Phase 11 (Swagger) as flexible — compress them first if you run short on time, since core features (auth, catalog, cart, checkout) matter more for interviews than these add-ons.

---

## PHASE 0: Environment & Tooling (before any code)

These steps exist so you understand *why* each tool is there, not just that it's installed.

- **0.1** — Install Node.js (LTS version), verify with `node -v` and `npm -v`. Ask agent to explain what Node/npm actually are and what "LTS" means.
- **0.2** — Create a MongoDB Atlas account, create a free cluster, get the connection string. Understand: what is a cluster, what is a connection string, why we don't hardcode it.
- **0.3** — Create the project root folder and initialize git (`git init`). Create `.gitignore` before anything else exists — ask the agent to explain each line it adds (node_modules, .env, dist, etc.) and why it matters.
- **0.4** — Decide and create the monorepo folder structure: `client/` and `server/` as siblings. Ask agent why a monorepo (vs two separate repos) makes sense here.

---

## PHASE 1: Backend Setup — Express + TypeScript (from absolute scratch)

Don't let the agent scaffold this with a generator in one shot — do it file by file so you see what each piece does.

- **1.1** — Inside `server/`, run `npm init -y`. Open `package.json` together — ask agent to explain every default field (name, version, main, scripts).
- **1.2** — Install TypeScript as a dev dependency only (`typescript`, `ts-node`, `@types/node`). Ask: why devDependency, not dependency? What's the difference?
- **1.3** — Run `npx tsc --init`, then go through `tsconfig.json` together — ask agent to explain `target`, `module`, `outDir`, `rootDir`, `strict` specifically (these come up in interviews).
- **1.4** — Install Express + its types (`express`, `@types/express`). Create `src/index.ts` with the absolute minimum: import express, create app, one `app.get('/')` route, `app.listen()`. Run it with `ts-node` manually (not nodemon yet) so you see the raw command.
- **1.5** — Install `nodemon` + `ts-node` dev workflow, add `dev` script to `package.json`. Understand why nodemon exists (auto-restart vs manual restart).
- **1.6** — Install `dotenv`, create `.env` (add to `.gitignore` — check it's actually ignored with `git status`), create `src/config/env.ts` to centralize env var access. Ask: why not just call `process.env.X` everywhere in the code?
- **1.7** — Install `cors`, add CORS middleware. Ask agent to explain what CORS actually blocks and why the frontend would fail without this.
- **1.8** — Install `mongoose`. Create `src/config/db.ts` with a `connectDB()` function. Call it from `index.ts`. Confirm connection with a console log. Ask: what does Mongoose do that the raw MongoDB driver doesn't?
- **1.9** — Set up basic error-handling middleware (a catch-all Express error handler) and a `src/middleware/notFound.ts` for 404s. Ask why error middleware must be registered *last*.
- **1.10** — Set up folder skeleton: `models/`, `routes/`, `controllers/`, `middleware/` (already have one file), `config/` (already have two). Create empty placeholder files so the structure is visible. Ask agent to explain the responsibility of each folder — you should be able to say this out loud in an interview.
- **1.11** — **[NEW] Logging with Winston.** Install `winston`. Before writing code, ask agent to explain plainly: why is `console.log` not enough in a real app (no log levels, no structured output, no easy way to turn off in production). Create `src/config/logger.ts` with a basic logger (info/warn/error levels, console transport for now). Replace your one existing `console.log` in `db.ts` with `logger.info(...)` so you see the real difference immediately. Ask: what's the difference between `logger.info` and `logger.error`, and when would you use each.

At this point: backend runs, connects to Atlas, has clean structure and real logging, does nothing useful yet. That's correct — business logic comes next, per feature.

---

## PHASE 2: Frontend Setup — React (Vite) + TypeScript + Tailwind (from scratch)

- **2.1** — In project root, scaffold with `npm create vite@latest client -- --template react-ts`. Ask agent to explain what Vite actually does differently from Create React App (dev server, bundling) — this comes up in interviews now since CRA is deprecated.
- **2.2** — `cd client && npm install`, run the dev server, confirm default page loads. Delete the boilerplate content, replace with a one-line placeholder so you know your own code is rendering, not the template's.
- **2.3** — Install Tailwind CSS for Vite (follow the Vite-specific install steps — ask agent to confirm it's using the Vite plugin path). Confirm a Tailwind utility class actually renders styling.
- **2.4** — Install `react-router-dom`. Set up a bare router with 2 placeholder routes (Home, one dummy page) so routing exists before real pages do.
- **2.5** — Set up `client/.env` for `VITE_API_URL` pointing to your Express server. Ask: why does a Vite public env var need the `VITE_` prefix specifically.
- **2.6** — Create a minimal `src/lib/api.ts` with a fetch wrapper (base URL + basic GET function). Test it by fetching your Phase 1 placeholder `/` route from Express and rendering the response on the homepage. This is your first full-stack round trip — don't skip verifying it actually works end to end.
- **2.7** — Set up folder structure: `src/components/`, `src/pages/`, `src/lib/`, `src/types/`, `src/store/` (for Zustand, added later). Ask agent to justify each folder's purpose.

---

## PHASE 3: Auth (feature template — repeat this pattern for every later feature)

This is the template you'll reuse. Notice the shape: **schema → route stub → validation → controller logic → security hardening → connect frontend → test manually.**

- **3.1** — Design the `User` schema on paper/in chat with the agent first (fields, types, which are required, any indexes) BEFORE writing Mongoose code. Ask: why hash the password, why never store it plain, what's a schema-level `select: false` on password.
- **3.2** — Write `models/User.ts` with the schema only — no methods yet. Verify it compiles.
- **3.3** — Install `bcrypt`. Add a pre-save hook to hash the password. Ask agent to explain the hook lifecycle and why hashing happens here vs in the controller.
- **3.4** — Create empty route file `routes/authRoutes.ts` and register it in `index.ts` with a placeholder `POST /api/auth/register` that just returns "not implemented". Confirm the route is reachable via Postman/Thunder Client before writing real logic.
- **3.5** — **[NEW] Input validation with Zod.** Install `zod`. Before writing code, ask agent to explain plainly: what problem does schema validation solve that manual `if (!req.body.email)` checks don't (centralized rules, better error messages, type inference). Create `src/validators/authValidators.ts` with a `registerSchema` (email format, password min length). Wire it into the register route as middleware that runs *before* the controller. Test with Postman by sending bad input and seeing the validation error come back.
- **3.6** — Implement the register controller (now trusting validated input): check existing user, create user, return response (no token yet). Test with Postman.
- **3.7** — Install `jsonwebtoken`. Implement login: verify password with bcrypt compare, issue JWT. Ask: what goes in the JWT payload, and what should NOT go in it.
- **3.8** — Decide token storage strategy (httpOnly cookie vs Authorization header) — ask agent to explain the security tradeoff of each before picking one.
- **3.9** — Write `middleware/auth.ts` to verify the token and attach user to `req`. Create one protected test route to confirm it blocks/allows correctly.
- **3.10** — **[NEW] Rate limiting.** Install `express-rate-limit`. Ask agent to explain plainly: what is a brute-force login attempt, and how does limiting requests per IP address stop it. Apply a rate limiter specifically to `/api/auth/login` and `/api/auth/register` (a handful of attempts per minute is enough for a demo). Test it by hitting login repeatedly and confirming you get blocked.
- **3.11** — Add a Zod schema for login too (email + password presence), reusing the same validation-middleware pattern from 3.5 — this repetition is intentional so the pattern sticks.
- **3.12** — Frontend: build register/login forms (no styling polish yet, just functional). Wire to the API. Store auth state in Zustand.
- **3.13** — Frontend: protect a route/page based on auth state, add logout. Manually test the full loop: register → login (rate-limited if you retry too fast) → access protected page → logout → blocked again.

---

## PHASE 4: Product Catalog (apply the same schema → route → validate → controller → frontend → test pattern)

- **4.1** — Design Product schema (name, price, category, stock, images[], description, ratingAvg).
- **4.2** — Write model, verify compiles.
- **4.3** — Seed script: write a script to insert ~30–50 fake products (use static image URLs, skip upload service).
- **4.4** — Route stub + controller: GET all products (no filters yet).
- **4.5** — Route + controller: GET single product by ID.
- **4.6** — Zod schema for product creation (name required, price positive number, etc.) — reuse the validation-middleware pattern.
- **4.7** — Admin-only: POST/PUT/DELETE product routes, protected by role middleware (extend auth middleware to check role).
- **4.8** — Frontend: product listing page fetching from API.
- **4.9** — Frontend: product detail page.

---

## PHASE 5: Redis Caching (new — sits right after the catalog exists, since there's now something worth caching)

- **5.1** — Create a free Upstash Redis instance (or run Redis locally via Docker once Phase 10 is done — Upstash is simpler for now). Get the connection URL.
- **5.2** — Before writing code, ask agent to explain plainly: what is an in-memory cache, why is reading from Redis faster than querying MongoDB every time, and what "cache invalidation" means in one sentence.
- **5.3** — Install the Redis client library. Create `src/config/redis.ts` with a connection function, mirroring the pattern you already used for `db.ts`.
- **5.4** — Modify ONLY the "get all products" controller: check Redis for a cached response first, return it if present; otherwise query MongoDB, store the result in Redis with an expiry (e.g. 60 seconds), then return it. Log (using your Winston logger from 1.11) whether each request was a cache hit or miss so you can literally see it working.
- **5.5** — Add cache invalidation: when a product is created/updated/deleted (admin routes from 4.7), delete the relevant cache key so stale data isn't served. Ask agent to explain why this step is easy to forget and what bugs happen if you skip it.
- **5.6** — Manually test: hit the listing endpoint twice (second should be faster / logged as a hit), then update a product as admin, hit listing again (should be a miss, reflecting the new data).

---

## PHASE 6: Search, Filter, Pagination
- **6.1** — Add query param handling on backend GET route (category, price range).
- **6.2** — Add pagination (limit/skip or cursor-based — ask agent to explain the tradeoff).
- **6.3** — Frontend: search bar + filter UI wired to query params.
- **6.4** — Debounce the search input, explain why debouncing matters here.
- **6.5** — Note: since search results change with filters, decide together whether the Phase 5 cache should apply here too, or only to the unfiltered listing — ask agent to explain the tradeoff (cache key complexity vs. hit rate).

---

## PHASE 7: Cart
- **7.1** — Design cart shape in Zustand store (client-only first).
- **7.2** — Add to cart / remove / update quantity actions.
- **7.3** — Persist cart to localStorage.
- **7.4** — Cart page UI.

---

## PHASE 8: Checkout + Stripe
- **8.1** — Create Stripe test account, get test API keys.
- **8.2** — Backend: create checkout session endpoint.
- **8.3** — Frontend: redirect to Stripe checkout.
- **8.4** — Backend: webhook endpoint for payment confirmation — understand why this exists instead of trusting the frontend redirect alone.
- **8.5** — On confirmed payment, create Order document.

---

## PHASE 9: Orders
- **9.1** — Order schema.
- **9.2** — GET order history (user-scoped).
- **9.3** — Order detail page.
- **9.4** — Admin: view all orders, update status.

---

## PHASE 10: Reviews & Ratings
- **10.1** — Review schema (linked to product + user).
- **10.2** — POST review (only if user purchased — optional stretch), reuse the Zod validation pattern for the review body.
- **10.3** — Aggregate average rating on product (Mongo aggregation pipeline — good interview topic).
- **10.4** — Frontend: display + submit reviews.

---

## PHASE 11: Docker (new — containerize what already works, don't build against a moving target)

- **11.1** — Before writing any file, ask agent to explain plainly: what problem does Docker solve here (it's NOT "makes it faster," it's "makes it run the same way on any machine"), and what's the difference between an image and a container.
- **11.2** — Write a `Dockerfile` for the backend only (multi-stage build: install deps, build TypeScript, run compiled JS). Ask agent to explain each instruction (`FROM`, `WORKDIR`, `COPY`, `RUN`, `CMD`) one at a time.
- **11.3** — Build the image locally (`docker build`), run it (`docker run`), confirm it responds on the expected port — but note it can't reach MongoDB yet if Atlas isn't reachable from inside the container network (usually fine since Atlas is cloud-hosted, but verify).
- **11.4** — Write a `docker-compose.yml` that runs the backend + a local Redis container together (this replaces Upstash for local dev, optionally). Ask: why docker-compose instead of running multiple `docker run` commands manually.
- **11.5** — Confirm the whole backend + Redis stack comes up with one `docker-compose up` and the caching from Phase 5 still works against the local Redis.

---

## PHASE 12: Swagger / API Docs (new — do this once the API surface is mostly stable)

- **12.1** — Before writing code, ask agent to explain plainly: what is OpenAPI/Swagger, and why is generated documentation more trustworthy than a hand-written README of endpoints (stays in sync with actual code vs. going stale).
- **12.2** — Install `swagger-jsdoc` and `swagger-ui-express`. Set up the base config (title, version, server URL) in `src/config/swagger.ts`, mount it at `/api-docs`.
- **12.3** — Document ONE route first (e.g. `POST /api/auth/register`) with a JSDoc comment block above it — confirm it renders correctly in the Swagger UI before doing any more.
- **12.4** — Once the pattern is confirmed working, document the rest of the auth and product routes the same way, one file at a time, checking the UI after each.

---

## PHASE 13: Polish & Deploy
- **13.1** — Loading/error states across pages.
- **13.2** — Basic responsive pass.
- **13.3** — Deploy backend (Render/Railway) — env vars set correctly, including Redis URL and any Swagger config.
- **13.4** — Deploy frontend (Vercel/Netlify) — pointing to deployed backend URL.
- **13.5** — Full end-to-end smoke test on the deployed version, including checking `/api-docs` loads and cached endpoints behave correctly in production.
- **13.6** — Write README with architecture summary + a simple diagram, listing the full stack (React, Express, MongoDB, Redis, Docker, Zod, Winston, rate limiting, Swagger).
- **13.7** — Write down resume bullet points while the details are fresh — especially the Redis before/after timing and the rate-limiting/validation additions, since those are your strongest "production thinking" evidence.

---

## Rules to keep the agent honest

- If the agent writes more than one file's worth of new logic in a single step, stop and ask it to split it.
- If the agent generates code and can't explain a specific line when you ask, that's a flag to research it yourself — don't move forward with something you can't defend.
- For anything genuinely new (Redis, Docker, Zod, rate limiting, Winston, Swagger), require the concept explanation *before* code is written for that step. For repetitive/mechanical steps (e.g. the fifth CRUD route, the third Zod schema), a quick after-the-fact explanation is enough.
- If a day's time budget is running out, compress Phase 11 (Docker) and Phase 12 (Swagger) first — they're valuable but not load-bearing for the app to function, unlike auth, catalog, cart, and checkout.
