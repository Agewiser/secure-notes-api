import 'dotenv/config'
import { buildApp } from './app.js'

const PORT = Number(process.env.PORT) || 4000

const fastify = await buildApp({ logger: true })

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}