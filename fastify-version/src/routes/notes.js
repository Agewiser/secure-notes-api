import { createNoteSchema, updateNoteSchema } from '../schemas/note.schema.js'
import { validateBody } from '../plugins/validate.js'

async function notesRoutes (fastify) {
    //GET /notes
    fastify.get ('/', async (request, reply) => {
        const notes = await fastify.prisma.note.findMany ({
            orderBy: { createdAt: 'desc' }
        })
        return notes //Fastify auto-serialises the return value
    })

    //GET/notes:id
    fastify.get('/:id', async (request, reply) => {
        const note = await fastify.prisma.note.findUnique ({
            where: { id: Number (request.params.id)}
        })
        if(!note) {
            return reply.code(404).send ({ error: 'Note not found' })
        }

        return note
    })

    //POST/notes
    fastify.post('/', { preHandler: validateBody(createNoteSchema) }, async (request, reply) => {
    const note = await fastify.prisma.note.create({ data: request.body })
    return reply.code(201).send(note)
  })

  // PUT /notes/:id
  fastify.put('/:id', { preHandler: validateBody(updateNoteSchema) }, async (request, reply) => {
    const existing = await fastify.prisma.note.findUnique({
      where: { id: Number(request.params.id) }
    })
    if (!existing) {
      return reply.code(404).send({ error: 'Note not found' })
    }
    const updated = await fastify.prisma.note.update({
      where: { id: Number(request.params.id) },
      data: request.body
    })
    return updated
  })

  // DELETE /notes/:id
  fastify.delete('/:id', async (request, reply) => {
    const existing = await fastify.prisma.note.findUnique({
      where: { id: Number(request.params.id) }
    })
    if (!existing) {
      return reply.code(404).send({ error: 'Note not found' })
    }
    await fastify.prisma.note.delete({ where: { id: Number(request.params.id) } })
    return reply.code(204).send()
  })
}

export default notesRoutes