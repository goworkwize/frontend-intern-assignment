import { z } from 'zod';

// Zod schema for Todo validation
export const todoSchema = z.object({
  userId: z.number().int().positive(),
  id: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean(),
});

// Schema for creating a new todo (id is optional as it will be generated)
export const createTodoSchema = z.object({
  userId: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().default(false),
});

// Schema for updating a todo (all fields optional except id)
export const updateTodoSchema = z.object({
  userId: z.number().int().positive().optional(),
  title: z.string().min(1, 'Title is required').optional(),
  completed: z.boolean().optional(),
});

// Type exports
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
