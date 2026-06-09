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
| API | Next.js API Routes |
| Base de datos | PostgreSQL (Neon) |
| ORM | Prisma |
| Hosting | Vercel |
| CI/CD | Vercel + GitHub |

## Estructura

```
rs-sports/
├── apps/
│   ├── web/          # Frontend Next.js  (puerto 3000)
│   ├── api/          # API Next.js        (puerto 3001)
│   └── mobile/       # App Flutter
├── packages/
│   ├── shared-types/ # Tipos TypeScript compartidos
│   ├── validation/   # Schemas de validación (Zod)
│   └── config/       # Constantes y configuración
├── database/
│   ├── prisma/       # schema.prisma
│   └── seed/         # Datos iniciales
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
AUTH_SECRET="genera-con: openssl rand -hex 32"
```

### 3. Preparar la base de datos

```bash
npm run db:generate   # genera el cliente Prisma
npm run db:migrate    # crea las tablas
```

## Levantar Proyectos

### Todo junto (recomendado)

```bash
npm run dev
```

### Solo el Frontend Web — puerto 3000

```bash
npm run dev -w apps/web
```

Abrir: <http://localhost:3000>

### Solo la API — puerto 3001

```bash
npm run dev -w apps/api
```

Verificar: <http://localhost:3001/api/health>

### App Móvil Flutter

```bash
cd apps/mobile

# Primera vez: inicializar la estructura completa de Flutter
flutter create . --project-name rs_sports

# Instalar dependencias
flutter pub get

# Correr en emulador o dispositivo Android
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

## Validar que Todo Funciona

```bash
# 1. Build de producción
npm run build

# 2. Lint
npm run lint

# 3. Health check (con el server corriendo)
curl http://localhost:3001/api/health
# Esperado: {"status":"ok","service":"api"}

# 4. Análisis estático Flutter
cd apps/mobile && flutter analyze
```

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL | Sí |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación | No |
| `NEXT_PUBLIC_API_URL` | URL pública de la API | No |
| `AUTH_SECRET` | Secret para sesiones (NextAuth) | En producción |
| `GOOGLE_CLIENT_ID` | ID de app Google OAuth | Opcional |
| `GOOGLE_CLIENT_SECRET` | Secret de app Google OAuth | Opcional |

## Documentación

- [MVP y Roadmap](docs/product/mvp.md)
- [Arquitectura](docs/architecture/overview.md)
- [Modelo de Base de Datos](docs/database/model.md)
- [Deploy en Vercel](docs/deployment/vercel.md)

## Primera prueba desde navegador

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar web + API simultáneamente

```bash
npm run dev
```

Turborepo arranca ambos servicios en paralelo:

| Servicio | URL |
|---------|-----|
| Web (Next.js) | http://localhost:3000 |
| API (Next.js) | http://localhost:3001 |

O levantarlos por separado en dos terminales:

```bash
# Terminal 1 — API
npm run dev -w apps/api

# Terminal 2 — Web
npm run dev -w apps/web
```

### 3. Qué debería verse en pantalla

Al abrir **http://localhost:3000** deberías ver:

- Título **RS Sports** con subtítulo
- Tres tarjetas de disciplinas: **Running**, **Ciclismo**, **Trekking**
- Sección "Qué podrás hacer" con 5 funcionalidades
- Sección "Estado del MVP" con indicadores de estado
- Sección "Conectividad API" con el resultado del health check en vivo:
  - Punto verde + `status: ok` + `service: api` → API funcionando correctamente
  - Punto rojo → la API no está corriendo

### 4. Verificar el health check directamente

```bash
curl http://localhost:3001/api/health
```

Respuesta esperada:

```json
{"status":"ok","service":"api"}
```

### 5. Troubleshooting

**Puerto 3000 ocupado:**

```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :3000

# Cambiar el puerto de web temporalmente
npm run dev -w apps/api -- --port 3002
```

**Puerto 3001 ocupado:**

```bash
netstat -ano | findstr :3001
```

**La sección "Conectividad API" muestra error en rojo:**
- Verificar que la API esté corriendo: `npm run dev -w apps/api`
- Verificar que el puerto 3001 no esté bloqueado por firewall
- CORS ya está configurado para `*` en desarrollo — si persiste, revisar `apps/api/next.config.ts`

**Error `command not found: turbo`:**

```bash
npm install          # instala turbo localmente
npm run dev          # vuelve a intentar
```

---

## Próximos Pasos

- [ ] Autenticación con NextAuth.js (Google OAuth + email)
- [ ] UI con Tailwind CSS + shadcn/ui
- [ ] Conectar base de datos en Neon
- [ ] CRUD de actividades (endpoints + UI)
- [ ] Feed social
- [ ] Sistema de likes y comentarios
- [ ] Endpoints de eventos y grupos
- [ ] App Flutter completa
- [ ] CI/CD con Vercel + GitHub Actions
