# rs-sports

Red social deportiva orientada al deporte outdoor: **Running**, **Ciclismo** y **Trekking**.

Una plataforma tipo Facebook/Instagram diseñada para la comunidad deportiva outdoor, con feed social, actividades, eventos, rankings y grupos.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Monorepo | Turborepo + npm workspaces |
| Frontend web | Next.js 15, React 19, TypeScript |
| App móvil | Flutter 3.x (Android → iOS) |
| API | Next.js API Routes (integradas en `apps/web`) |
| Base de datos | PostgreSQL (Neon) |
| ORM | Prisma |
| Hosting | Vercel |
| CI/CD | Vercel + GitHub |

## Estructura

```
rs-sports/
├── apps/
│   ├── web/          # Frontend Next.js  (puerto 3000) — incluye API Routes
│   ├── api/          # API standalone    (puerto 3001) — health check
│   └── mobile/       # App Flutter
├── packages/
│   ├── shared-types/ # Tipos TypeScript compartidos
│   ├── validation/   # Schemas de validación (Zod)
│   └── config/       # Constantes y configuración
├── database/
│   ├── prisma/       # schema.prisma
│   └── seed/         # Datos iniciales (idempotente)
└── docs/
    ├── product/      # mvp.md
    ├── architecture/ # overview.md
    ├── database/     # model.md
    └── deployment/   # vercel.md
```

## Requisitos Previos

- Node.js 20+
- npm 10+
- Flutter SDK 3.x (para la app móvil)
- PostgreSQL o cuenta en [Neon](https://neon.tech)

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rs_sports"
NEXT_PUBLIC_APP_NAME="rs-sports"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Preparar la base de datos

```bash
npm run db:generate   # genera el cliente Prisma
npm run db:migrate    # crea las tablas
```

### 4. Ejecutar el seed

```bash
npx tsx database/seed/index.ts
```

El seed es **idempotente**: se puede ejecutar múltiples veces sin duplicar registros. Crea:
- 3 deportes (Running, Ciclismo, Trekking)
- 11 usuarios demo
- 20 actividades
- 5 eventos con participantes reales
- 5 grupos con miembros reales

## Levantar Proyectos

### Todo junto (recomendado)

```bash
npm run dev
```

### Solo el Frontend Web — puerto 3000

```bash
npm run dev -w apps/web
```

### Solo la API standalone — puerto 3001

```bash
npm run dev -w apps/api
```

### App Móvil Flutter

```bash
cd apps/mobile
flutter create . --project-name rs_sports
flutter pub get
flutter run
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Levanta todos los proyectos en modo dev |
| `npm run build` | Build de producción de todos los proyectos |
| `npm run lint` | Linting en todos los proyectos |
| `npm run format` | Formatea el código con Prettier |
| `npm run db:generate` | Genera el cliente Prisma |
| `npm run db:migrate` | Ejecuta migraciones de base de datos |
| `npm run db:studio` | Abre Prisma Studio (explorador visual) |

---

## Endpoints API

Todos los endpoints son parte de `apps/web` (puerto 3000 en dev).

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/home` | Métricas globales + próximos 3 eventos |
| GET | `/api/sports` | Lista de deportes disponibles |
| GET | `/api/activities` | Feed de actividades (últimas 50) |
| POST | `/api/activities` | Registrar nueva actividad |
| GET | `/api/events` | Eventos próximos ordenados por fecha |
| GET | `/api/groups` | Comunidades con miembros y actividad reciente |
| GET | `/api/rankings` | Top 10 por deporte calculado desde actividades reales |
| GET | `/api/profile/[username]` | Perfil, actividades y logros calculados |

### Probar endpoints (con el servidor corriendo)

```bash
# Métricas globales y próximos eventos
curl http://localhost:3000/api/home

# Lista de deportes
curl http://localhost:3000/api/sports

# Feed de actividades
curl http://localhost:3000/api/activities

# Eventos próximos
curl http://localhost:3000/api/events

# Comunidades
curl http://localhost:3000/api/groups

# Rankings por disciplina
curl http://localhost:3000/api/rankings

# Perfil de usuario con logros calculados
curl http://localhost:3000/api/profile/demo_runner
curl http://localhost:3000/api/profile/carlos_morales
```

### Respuesta esperada de `/api/home`

```json
{
  "metrics": {
    "activities": 20,
    "athletes": 11,
    "events": 5,
    "groups": 5
  },
  "upcomingEvents": [...]
}
```

### Respuesta esperada de `/api/rankings`

```json
{
  "rankings": {
    "RUNNING": [
      { "position": 1, "name": "Carlos Morales", "username": "carlos_morales", "score": 59.3, "unit": "km", "activities": 3 }
    ],
    "CYCLING": [...],
    "TREKKING": [...]
  }
}
```

### Respuesta esperada de `/api/profile/[username]`

```json
{
  "user": { "id": "...", "name": "...", "stats": { "activities": 3, "totalKm": 47.3, "followers": 0, "following": 0 } },
  "activities": [...],
  "achievements": [
    { "icon": "🏅", "title": "Primer 10K", "description": "Completó una actividad de running de al menos 10 km" }
  ]
}
```

---

## Probar el frontend

Con `npm run dev` corriendo:

| Pantalla | URL |
|----------|-----|
| Landing | http://localhost:3000/ |
| Feed | http://localhost:3000/feed |
| Eventos | http://localhost:3000/events |
| Comunidades | http://localhost:3000/groups |
| Rankings | http://localhost:3000/rankings |
| Perfil | http://localhost:3000/profile/demo_runner |

---

## Validar ausencia de fallbacks

Buscar en el código fuente que no queden datos hardcodeados de negocio:

```bash
# No deben aparecer resultados en apps/web/src/app o apps/web/src/components
grep -r "FALLBACK_EVENTS\|FALLBACK_GROUPS\|DEMO_EVENTS\|DEMO_ACHIEVEMENTS\|DEMO_RANKING\|hashNum" apps/web/src/app apps/web/src/components
```

El resultado debe estar vacío.

---

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL | Sí |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación | No |
| `NEXT_PUBLIC_API_URL` | URL de la API standalone (puerto 3001) | No |

---

## Próximos Pasos

- [ ] Autenticación (NextAuth.js)
- [ ] Likes y comentarios reales
- [ ] Suscripción a grupos y eventos
- [ ] App Flutter completa
- [ ] CI/CD con Vercel + GitHub Actions
