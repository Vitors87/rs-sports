# Arquitectura — rs-sports

## Diagrama de Alto Nivel

```
┌──────────────────────┐     ┌──────────────────────┐
│     Web App          │     │     Mobile App        │
│  Next.js (port 3000) │     │  Flutter (Android)    │
└──────────┬───────────┘     └──────────┬────────────┘
           │                            │
           └──────────┬─────────────────┘
                      ▼
           ┌──────────────────────┐
           │        API           │
           │  Next.js (port 3001) │
           │  GET /api/health     │
           └──────────┬───────────┘
                      │
                      ▼
           ┌──────────────────────┐
           │    Base de Datos     │
           │  PostgreSQL (Neon)   │
           │  ORM: Prisma         │
           └──────────────────────┘
```

## Stack

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Monorepo | Turborepo + npm workspaces | Build caching, pipelines paralelos |
| Frontend | Next.js 15 + React 19 + TypeScript | SSR, SEO, App Router |
| API | Next.js API Routes | Mismo deploy que web, migración fácil |
| Mobile | Flutter 3.x | Cross-platform, Android primero |
| Base de datos | PostgreSQL en Neon | Serverless, branch por entorno |
| ORM | Prisma | Tipos generados, migraciones, Studio |
| Hosting | Vercel | CI/CD integrado con GitHub |

## Estructura del Monorepo

```
rs-sports/
├── apps/
│   ├── web/          — Frontend (port 3000)
│   ├── api/          — API (port 3001)
│   └── mobile/       — Flutter (Android → iOS)
├── packages/
│   ├── shared-types/ — Tipos de dominio compartidos
│   ├── validation/   — Schemas Zod
│   └── config/       — Constantes y enums
└── database/
    ├── prisma/       — schema.prisma
    └── seed/         — Datos iniciales
```

## Packages Compartidos

### @rs-sports/shared-types
Tipos TypeScript para todas las entidades: User, Sport, Activity, Event, Post, Comment, Like, Ranking, Group.

### @rs-sports/validation
Schemas Zod reutilizables en API y frontend para validación de inputs.

### @rs-sports/config
Constantes compartidas: SPORT_TYPES, SPORT_LABELS, RANKING_PERIODS, PAGINATION_DEFAULTS.

## Decisiones de Arquitectura

**¿Por qué Next.js para la API?**
Simplicidad inicial: un solo framework para web y API, deploy unificado en Vercel. Se puede extraer a microservicio más adelante.

**¿Por qué Flutter?**
Un solo codebase para Android e iOS. Rendimiento cercano al nativo. Primera versión solo Android para reducir complejidad inicial.

**¿Por qué Prisma?**
Tipos generados automáticamente del schema, migraciones declarativas y Prisma Studio para explorar datos en desarrollo.

## Decisiones Pendientes

- Autenticación: NextAuth.js vs Clerk
- Estado global: Zustand vs TanStack Query
- Estilos: Tailwind CSS + shadcn/ui
- API design: REST vs tRPC
