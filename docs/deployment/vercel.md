# Deployment en Vercel — rs-sports

## Prerrequisitos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub
- Base de datos PostgreSQL en [Neon](https://neon.tech)

## 1. Base de Datos en Neon

1. Crear cuenta y proyecto en neon.tech
2. Copiar la connection string: `postgresql://user:pass@host/db?sslmode=require`
3. Guardarla como `DATABASE_URL`

## 2. Conectar Vercel con GitHub

1. Vercel Dashboard → New Project → Import desde GitHub
2. Vercel detecta Next.js automáticamente

## 3. Configurar Cada App en Vercel

Para `apps/web`:

| Setting | Valor |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Build Command | `cd ../.. && npm run build --workspace=apps/web` |

Para `apps/api`:

| Setting | Valor |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `apps/api` |
| Build Command | `cd ../.. && npm run build --workspace=apps/api` |

## 4. Variables de Entorno en Vercel

Settings → Environment Variables:

| Variable | Scope |
|----------|-------|
| `DATABASE_URL` | Production, Preview |
| `NEXT_PUBLIC_APP_NAME` | All |
| `NEXT_PUBLIC_API_URL` | Production |
| `AUTH_SECRET` | Production, Preview |
| `GOOGLE_CLIENT_ID` | Production |
| `GOOGLE_CLIENT_SECRET` | Production |

## 5. Pipeline CI/CD

```
Push a GitHub
     │
     ├── feature/* → Preview deploy
     │              URL: https://rs-sports-git-feature-xyz.vercel.app
     │
     └── main → Production deploy
                URL: https://rs-sports.vercel.app
```

## 6. Migraciones en Producción

Ejecutar antes de cada deploy con cambios de schema:

```bash
DATABASE_URL=<prod-url> npx prisma migrate deploy \
  --schema=./database/prisma/schema.prisma
```

## Checklist de Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones aplicadas en base de datos de producción
- [ ] `npm run build` exitoso localmente
- [ ] `npm run lint` sin errores
- [ ] Health check responde: `GET /api/health → {"status":"ok","service":"api"}`
