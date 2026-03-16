import Fastify from 'fastify'
import securityPlugin from './plugins/security.js'
import prismaPlugin from './plugins/prisma.js'
import notesRoutes from './routes/notes.js'
import { errorHandler } from './middlewares/errorHandler.js'

export async function buildApp(opts = {}) {
  const fastify = Fastify({
    logger: opts.logger ?? true,
    bodyLimit: 10 * 1024, // 10KB body limit — set at the framework level, not middleware
    trustProxy: true
  })

  // Register plugins (order matters — security before routes)
  await fastify.register(securityPlugin)
  await fastify.register(prismaPlugin)

  // Register routes with /api/v1 prefix
  fastify.register(notesRoutes, { prefix: '/api/v1/notes' })

  // 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ error: `Route ${request.method} ${request.url} not found` })
  })

  // Centralised error handler
  fastify.setErrorHandler(errorHandler)

  return fastify
}