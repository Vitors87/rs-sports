import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nombre muy corto').max(100),
  username: z
    .string()
    .min(3, 'Username muy corto')
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guiones bajos'),
  bio: z.string().max(500).optional(),
});

export const createActivitySchema = z.object({
  sportId: z.string().cuid('ID de deporte inválido'),
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().max(1000).optional(),
  distance: z.number().positive().optional(),
  duration: z.number().positive().int().optional(),
  elevation: z.number().optional(),
  date: z.coerce.date(),
});

export const createPostSchema = z.object({
  content: z.string().min(1, 'El contenido es requerido').max(2000),
  activityId: z.string().cuid().optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'El comentario es requerido').max(1000),
});

export const createEventSchema = z.object({
  sportId: z.string().cuid('ID de deporte inválido'),
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  date: z.coerce.date(),
  maxParticipants: z.number().positive().int().optional(),
});

export const createGroupSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto').max(100),
  description: z.string().max(500).optional(),
  sportId: z.string().cuid().optional(),
  isPrivate: z.boolean().default(false),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
