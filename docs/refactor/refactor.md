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
Below is a **45-step** sequence that smart AI agents (Cursor delegates, GitHub Copilot, Supabase CLI bots) and human developers will follow to deliver the full refactor. Each step is atomic and should generate a single PR or merge request.

1. **Create Supabase branch `refactor-sprint-1`.**
2. **Generate ERD** using `supabase db schemas graphql` → export `docs/db/erd.png`.
3. **Draft `docs/db/standards.md`** – naming, casing, timestamps, RLS philosophy.
4. **Scaffold `docs/codebase/structure.md`** – domain layout, examples.
5. **Create `docs/templates/domain-README.md`** – template for per-domain readmes.
6. **Enable RLS globally**: loop through tables → `ENABLE ROW LEVEL SECURITY` migration.
7. **Create default deny policies** for every table.
8. **Write helper SQL function `current_user_id()` for policy shortcuts.**
9. **Add `created_at`, `updated_at`, `deleted_at` columns** to legacy tables.
10. **Create trigger `handle_timestamps()`** and attach to all tables.
11. **Write `deleted_at` RLS filter policy** (select only not deleted).
12. **Introduce Postgres enum `task_status`** (+ TS regen) & migrate columns.
13. **Repeat for other enums (`plan_stage`, `payment_status`).**
14. **Add missing foreign keys** with `ON DELETE CASCADE` where safe.
15. **Audit indexes** → add B-tree on `foreign_key_id`, `created_at`, enums.
16. **Add GIN index for JSON/text search columns (e.g., `metadata`).**
17. **Split tables into new `onboarding` schema** – migrate `onboarding_*` tables.
18. **Create `projects` schema** – move project, task, timeline tables.
19. **Move analytics/time-series tables into `analytics` schema**.
20. **Regenerate Supabase types (`supabase gen types typescript`).**
21. **Add barrel `src/domains/onboarding/index.ts`** exporting hooks & types.
22. **Move React onboarding components to `src/domains/onboarding/components`.**
23. **Refactor imports using VSCode rename + ESLint autofix.**
24. **Insert README.md into onboarding domain** using template.
25. **Repeat 21–24 for `projects` domain.**
26. **Create `common/components` for shared UI – move Button, Modal, etc.**
27. **Add path aliases in `tsconfig.json` (`@/domains/*`).**
28. **Fix Jest/Vite alias config.**
29. **Run `eslint --fix` and `tsc --noEmit` to ensure type safety.**
30. **Implement CI Step: `sqlfluff lint .` on PRs.**
31. **Implement CI Step: `supabase db reset --linked` dry-run migrations.**
32. **Implement CI Step: `npm run test` for unit tests.**
33. **Create seed scripts (`supabase db seed`) for local dev.**
34. **Add `docs/db/changelog.md` and populate Sprint 1 changes.**
35. **Write ADR-001: "Adopt Domain-Driven Schemas".**
36. **Write ADR-002: "Soft Delete & RLS Pattern".**
37. **Generate OpenAPI spec for custom REST endpoints → `docs/api/openapi.yaml`.**
38. **Document Supabase Edge Functions architecture in `docs/adr/edge-functions.md`.**
39. **Implement audit log table + Edge Function Slack webhook.**
40. **Set up Postgres `NOTIFY` triggers for realtime dashboards.**
41. **Create Timescale extension for analytics schema (if needed).**
42. **Benchmark critical queries with `EXPLAIN ANALYZE` & update indexes.**
43. **Run load tests (k6) to reach <200 ms P95 latency goal.**
44. **Merge Sprint 1 branch → release note in `docs/releases/2025-refactor-sprint-1.md`.**
45. **Update roadmap & backlog, start `refactor-sprint-2` branch.**

> Each step should contain clear acceptance criteria in the PR description so AI code reviewers can auto-approve when tests pass.

---

> **Last updated:** <!-- keep me --> 