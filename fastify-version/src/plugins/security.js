import fp from 'fastify-plugin'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'

async function securityPlugin(fastify) {
//helmet setup
    await fastify.register(helmet, {
        contentSecurityPolicy: false
    })
//cors setup
await fastify.register(cors, {
    origin:process.env.ALLOWED_ORIGINS?.split || false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
})
}

export default fp(securityPlugin)