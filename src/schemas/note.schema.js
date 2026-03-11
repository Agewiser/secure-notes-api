import { z } from 'zod'

export const createNoteSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),
  content: z
    .string({ required_error: 'Content is required' })
    .min(1, 'Content cannot be empty')
    .max(10000, 'Content cannot exceed 10,000 characters')
    .trim(),
})

export const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters')
    .trim()
    .optional(),
  content: z
    .string()
    .min(1, 'Content cannot be empty')
    .max(10000, 'Content cannot exceed 10,000 characters')
    .trim()
    .optional(),
}).refine(
  (data) => data.title !== undefined || data.content !== undefined,
  { message: 'At least one field (title or content) must be provided', path: ['title'] }
)

export const noteIdSchema = z.object({
  id: z.string().cuid({ message: 'Invalid note ID format' }),
})