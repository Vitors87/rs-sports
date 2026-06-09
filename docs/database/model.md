# Modelo de Base de Datos — rs-sports

## Entidades

### User
Perfil de usuario de la plataforma.

| Campo     | Tipo     | Descripción               |
|-----------|----------|---------------------------|
| id        | cuid     | Identificador único       |
| email     | string   | Email único (login)       |
| username  | string   | Handle único (@usuario)   |
| name      | string   | Nombre para mostrar       |
| bio       | string?  | Descripción del perfil    |
| avatarUrl | string?  | URL de foto de perfil     |

### Sport
Disciplinas disponibles. Datos fijos seeded en la base de datos.

| Tipo     | Nombre    |
|----------|-----------|
| RUNNING  | Running   |
| CYCLING  | Ciclismo  |
| TREKKING | Trekking  |

### Activity
Registro de actividad deportiva de un usuario.

| Campo       | Tipo    | Descripción               |
|-------------|---------|---------------------------|
| distance    | float?  | Distancia en metros       |
| duration    | int?    | Duración en segundos      |
| elevation   | float?  | Desnivel en metros        |
| status      | enum    | DRAFT o PUBLISHED         |

### Post
Publicación en el feed social. Puede estar vinculada a una actividad.

### Comment
Comentario en una publicación.

### Like
Like en un Post o Comment. Constraint único por usuario.

### Event
Evento deportivo con fecha, lugar y número máximo de participantes.

### Group
Grupo o comunidad. Puede ser de una disciplina específica o abierto.

### Ranking
Posición de un usuario en una disciplina para un período dado (all-time, monthly, weekly).

## Relaciones

```
User ──┬── Activity ──── Post ──┬── Comment ──── Like
       │                        └── Like
       ├── EventParticipant ──── Event ──── Sport
       ├── GroupMember ──── Group ──── Sport
       └── Ranking ──── Sport
```

## Enumeraciones

```prisma
enum SportType      { RUNNING  CYCLING  TREKKING }
enum ActivityStatus { DRAFT    PUBLISHED }
enum EventStatus    { UPCOMING ONGOING  COMPLETED  CANCELLED }
```

## Índices Únicos

| Tabla              | Campos                    | Motivo                       |
|--------------------|---------------------------|------------------------------|
| users              | email                     | Login único                  |
| users              | username                  | Handle único                 |
| sports             | type                      | Un registro por disciplina   |
| likes              | (userId, postId)          | Un like por usuario por post |
| likes              | (userId, commentId)       | Un like por comentario       |
| event_participants | (userId, eventId)         | No duplicar inscripciones    |
| group_members      | (userId, groupId)         | No duplicar membresías       |
| rankings           | (userId, sportId, period) | Una entrada por combinación  |

## Comandos

```bash
npm run db:generate   # Genera el cliente Prisma
npm run db:migrate    # Crea/actualiza tablas
npm run db:studio     # Abre explorador visual
```

El schema completo está en [database/prisma/schema.prisma](../../database/prisma/schema.prisma).
