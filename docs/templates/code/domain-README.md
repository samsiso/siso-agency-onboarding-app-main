# <Domain Name> Domain README

> Replace `<Domain Name>` with actual domain (e.g., Onboarding, Projects).

## 📚 Purpose
Briefly describe what business capability this domain owns and its relationship to the overall platform.

## 🗄️ Database Tables
| Table | Description |
|-------|-------------|
| `<schema>.<table>` | Concise description |

## 📁 Directory Layout
```
<root>/src/domains/<domain>/
  api/          # Supabase queries & rpc wrappers
  components/   # React UI elements
  hooks/        # Reusable hooks
  services/     # Business logic / orchestration
  types.ts      # Domain-specific TypeScript types
  index.ts      # Barrel export
```

## 🔑 Key Types & Interfaces
List primary TS types exported by this domain (or link to `types.ts`).

## 🔐 Security & RLS Policies
Explain any special Row-Level Security rules or access patterns.

## ⚙️ Business Logic Summary
High-level overview of workflows handled here (use bullet list).

## 📈 Metrics & KPIs
Optional: metrics this domain impacts.

## 🔗 Upstream & Downstream Dependencies
- **Consumes:** <list>
- **Produces:** <list>

---
_Keep this README updated as the domain evolves._ 