# 📚 Database Refactor Strategy – SISO Agency Onboarding App

---

## 🎯 Purpose
This document captures the end-to-end plan for refactoring our Supabase PostgreSQL database so that it is:
1. **Secure** – Row-Level Security on by default, principle-of-least-privilege policies.
2. **Performant** – Proper indexes, domain-driven schemas, soft-delete pattern, analytics ready.
3. **AI-Friendly** – Strict typing via Postgres enums + generated TypeScript, predictable naming, reusable patterns.
4. **Developer-Friendly** – Clear standards, automated migrations, CI validation, seed data for local dev.

## 🏆 Expected Outcomes for Our Use-Case
| Outcome | Impact on SISO Agency Onboarding |
|---------|----------------------------------|
| 🔐 Hardened Security | Eliminates ad-hoc API code for auth checks; front-end uses default RLS filtering. |
| ⚡ Faster Queries | App dashboards (clients, tasks, plans) load <200 ms with indexed filters. |
| 🧑‍💻 Reduced Onboarding Time | New engineers & AI agents understand schema in <15 min with ERD + standards. |
| 🔄 Seamless Feature Generation | Gemini/GPT agents can scaffold new tables & hooks automatically from enum-types. |
| 🔥 Lower Operational Risk | CI prevents broken migrations; branch databases enable safe experimentation. |

## 📐 Refactor Principles
1. **Domain-Driven Schemas** – Split `public` into `onboarding`, `projects`, `analytics`, `internal`.
2. **Consistent Naming** – `snake_case`, plural tables (`daily_summaries`), singular column names (`user_id`).
3. **UUID Primary Keys** – `uuid` default `gen_random_uuid()` for all tables.
4. **Timestamps Everywhere** – `created_at`, `updated_at`, `deleted_at` with trigger `handle_timestamps()`.
5. **Soft Delete** – Never delete rows; RLS filters out `deleted_at IS NOT NULL`.
6. **Enums over Strings** – Replace free-text status columns with Postgres enums (mirrored in TS).
7. **Foreign Keys & Cascades** – Enforce data integrity, use `ON DELETE CASCADE` or `SET NULL` as needed.
8. **RLS First** – Policies for `select`, `insert`, `update`, `delete` per role claim.
9. **Event-Driven Logic** – Business logic lives in SQL functions & Edge Functions triggered by `NOTIFY`/`realtime`.
10. **Automated Validation** – `sqlfluff` lint, migration dry-run in GitHub Actions using branch DB.

## 🗂️ Codebase Structure Vision
To maximise developer velocity **and** enable LLM agents to reason about the project quickly, we will migrate to a *domain-centric mono-repo* layout. Every domain maps 1-to-1 with a database schema and contains React UI, hooks, services, and tests.

```
src/
  domains/
    onboarding/
      api/          # Supabase queries & rpc wrappers
      components/   # React UI specific to onboarding
      hooks/        # Reusable data hooks (useOnboardingSteps)
      services/     # Business logic (chat orchestration, plan generation)
      types.ts      # Domain-specific TypeScript types (barrel export)
      index.ts      # Barrel re-export for easy AI discovery
    projects/
    analytics/
    ...
common/
  components/       # Truly global UI (buttons, modals)
  hooks/
  utils/
```

Guidelines:
1. **One directory per domain** – mirrors DB schema; AI can infer ownership.
2. **Barrel Files** – every directory exports via `index.ts` so embeddings list all symbols.
3. **README.md in each domain** – describes purpose, DB tables, critical flows.
4. **File Names** – `kebab-case` for components (e.g., `project-card.tsx`), `camelCase` for hooks.
5. **Max 500 lines per file** – split large components/services for chunkable embeddings.
6. **Tags in comments** – `// @domain onboarding` helps vector DB search engines.

## 📄 Documentation & AI Context Strategy
LLM agents rely on *rich but concise* context. We will:
1. Generate **automatic API docs** via `supabase gen types rust > docs/api/types.md`.
2. Maintain **`docs/codebase/structure.md`** – living diagram of directory layout with purpose of each folder.
3. Each migration PR must update **`docs/db/changelog.md`** with human-readable summary.
4. Adopt **ADR (Architecture Decision Records)** in `docs/adr/` for significant choices – easy for AI to follow rationale.
5. Use **OpenAPI** spec for any REST endpoints and place in `docs/api/openapi.yaml`.
6. Link docs from README so ChatGPT plugins & RAG pipelines see them first.

## 🚧 Refactor Backlog (Priority)
| Priority | Task | Description |
|----------|------|-------------|
| P0 | ERD & Standards Doc | Generate ERD (`docs/db/erd.png`) & write naming conventions. |
| P0 | Enable RLS Globally | `ALTER TABLE … ENABLE ROW LEVEL SECURITY;` + default deny policies. |
| P0 | Add Timestamp Trigger | Create `handle_timestamps()` & apply to every table. |
| P0 | Codebase Structure Doc | Draft `docs/codebase/structure.md` & sample domain README template. |
| P1 | Domain Schema Split | Move tables into `onboarding`, `projects`, etc.; update supabase types. |
| P1 | Repo Re-org | Move React code into `src/domains/`, create barrel exports + update imports. |
| P1 | Enum Migration | Convert status/text columns → Postgres enums; regenerate TS types. |
| P1 | Foreign Keys Audit | Add missing constraints & appropriate cascades. |
| P2 | Index Optimisation | Add B-tree on filter columns, GIN on JSON/text search fields. |
| P2 | Seed & Fixture Data | `supabase db seed` scripts for local dev & CI tests. |
| P2 | Observability | Create audit log table + Edge Function for Slack alerts on critical writes. |

## 🗓️ Milestones & Timeline
| Sprint | Key Deliverables |
|--------|------------------|
| **Sprint 1** (1 wk) | ERD, standards doc, timestamp trigger, RLS enablement. |
| **Sprint 2** (2 wk) | Domain schema migration + enum refactor. |
| **Sprint 3** (1 wk) | FK & index optimisation, seed scripts. |
| **Sprint 4** (ongoing) | Observability & event-driven functions. |

## 🔄 Migration Workflow
1. **Branch**: `supabase branch create refactor-stage-N` per sprint.
2. **Migrate**: Write SQL in `supabase/migrations/<timestamp>_…`.
3. **CI**: Lint with `sqlfluff`, run `supabase db reset --linked` to validate.
4. **Review**: PR must include updated ERD & regenerated types.
5. **Merge**: `supabase branch merge` into `main` after approval.

## 📈 KPI Targets
- <200 ms P95 query latency for dashboard endpoints.
- 100 % tables with RLS & test coverage.
- 0 schema drift warnings in Supabase advisor.

## 👥 Contributors
- **DB Lead**: _TBD_
- **Backend**: _TBD_
- **Frontend/Types**: _TBD_
- **AI Agents**: _Automated PR reviewer & type generator_

## 🛠️ Detailed Task Breakdown for AI-Assisted Execution
Below is a **42-step** sequence that smart AI agents (Cursor delegates, GitHub Copilot, Supabase CLI bots) and human developers will follow. Each step should correspond to a single focused PR.

1. **Create Supabase branch `refactor-sprint-1`** and add branch-naming convention to `CONTRIBUTING.md`.
2. **Generate ERD** (`docs/db/erd.png`) via `supabase db schemas graphql`.
3. **Draft `docs/db/standards.md`** – naming, casing, timestamps, RLS philosophy.
4. **Scaffold `docs/codebase/structure.md`** – domain layout, path aliases.
5. **Create `docs/templates/domain-README.md`** – template for per-domain docs.
6. **Enable RLS globally** and add default-deny policies (single migration file).
7. **Create helper function `current_user_id()`** for policy shortcuts.
8. **Add audit timestamp columns** (`created_at`, `updated_at`, `deleted_at`).
9. **Create trigger `handle_timestamps()`** and attach to all tables.
10. **Implement soft-delete select policy** (`deleted_at IS NULL`).
11. **Migrate primary keys to UUID** (`gen_random_uuid()`) where still serial.
12. **Introduce enums (`task_status`, `plan_stage`, `payment_status`)** and migrate columns.
13. **Add missing foreign keys** with appropriate `ON DELETE` behaviour.
14. **Create indexes** on FK columns & `created_at`.
15. **Add `GIN / GIN-Trgm` indexes** for JSON / text search fields.
16. **Create new schema `onboarding`** and migrate related tables.
17. **Create new schema `projects`** and migrate project/task tables.
18. **Create new schema `analytics`** and move time-series tables.
19. **Regenerate TypeScript types** (`supabase gen types typescript`).
20. **Add `npm run typegen:watch`** script to auto-regenerate types after migrations.
21. **Move React onboarding code to `src/domains/onboarding`** and add barrel export.
22. **Repeat step 21 for `projects` domain**.
23. **Create `src/common/components`** and move global UI elements.
24. **Configure path aliases** in `tsconfig.json`, Jest, Vite, and ESLint.
25. **Run `eslint --fix` and `tsc --noEmit`** to ensure type safety.
26. **Add pre-commit hooks** with `lint-staged` (ESLint + prettier + tsc).
27. **Create seed scripts** using `supabase db seed` for local dev & CI.
28. **Add `docs/db/changelog.md`** and log Sprint 1 changes.
29. **Set up GitHub Actions CI**: `sqlfluff lint`, `supabase db reset --linked`, tests, typecheck.
30. **Write ADR-001: “Domain-Driven Schemas”.**
31. **Write ADR-002: “Soft Delete & RLS Pattern”.**
32. **Write ADR-003: “UUID Primary Keys”.**
33. **Generate OpenAPI spec** for custom REST endpoints → `docs/api/openapi.yaml`.
34. **Document Edge Functions architecture** in `docs/adr/edge-functions.md`.
35. **Implement audit log table** + Edge Function Slack webhook.
36. **Set up Postgres `NOTIFY` triggers** for realtime dashboards.
37. **Benchmark critical queries** with `EXPLAIN ANALYZE` & update indexes.
38. **Run load tests** (k6) to reach <200 ms P95 latency goal.
39. **Schedule nightly Supabase Advisor run** & alert on drift/perf notices.
40. **Publish release notes** `docs/releases/2025-refactor-sprint-1.md`.
41. **Merge Sprint 1 branch into `main`** after approvals & green CI.
42. **Update roadmap & open `refactor-sprint-2` branch**.

> _Each PR must include acceptance criteria so automated reviewers can safely merge when checks pass._

---

> **Last updated:** <!-- keep me --> 