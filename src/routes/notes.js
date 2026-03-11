import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { validate, validateParams } from '../middleware/validate.js'
import { createNoteSchema, updateNoteSchema, noteIdSchema } from '../schemas/note.schema.js'

const router = Router()

// GET /api/notes — fetch all notes
router.get('/', async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    res.json({ data: notes, count: notes.length })
  } catch (error) {
    next(error)
  }
})

// GET /api/notes/:id — fetch a single note
router.get('/:id', validateParams(noteIdSchema), async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
    })

    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    res.json({ data: note })
  } catch (error) {
    next(error)
  }
})

// POST /api/notes — create a note
router.post('/', validate(createNoteSchema), async (req, res, next) => {
  try {
    const { title, content } = req.body

    const note = await prisma.note.create({
      data: { title, content },
    })

    res.status(201).json({ data: note })
  } catch (error) {
    next(error)
  }
})

// PATCH /api/notes/:id — update a note
router.patch(
  '/:id',
  validateParams(noteIdSchema),
  validate(updateNoteSchema),
  async (req, res, next) => {
    try {
      const note = await prisma.note.findUnique({
        where: { id: req.params.id },
      })

      if (!note) {
        return res.status(404).json({ error: 'Note not found' })
      }

      const updated = await prisma.note.update({
        where: { id: req.params.id },
        data: req.body,
      })

      res.json({ data: updated })
    } catch (error) {
      next(error)
    }
  }
)

// DELETE /api/notes/:id — delete a note
router.delete('/:id', validateParams(noteIdSchema), async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
    })

    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    await prisma.note.delete({
      where: { id: req.params.id },
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router