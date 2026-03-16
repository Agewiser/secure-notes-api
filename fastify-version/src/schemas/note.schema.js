import { z } from 'zod'

export const createNoteSchema = z.object ({
    title: z.string().min (1, 'Title is required').max(100, 'Title max 100 chars'),
    content: z.string().min(1, 'Content is required').max(5000, 'Content max 5000 chars')
})

export const updateNoteSchema = z.object ({
   title: z.string().min(1).max(100).optional(),
   content: z.string().min(1).max(5000).optional() 
}).refine(data => data.title !==undefined || data.content !==undefined, {
    message: 'At least one field (title or content) must be provided'
})