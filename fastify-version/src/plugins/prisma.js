import fp from 'fastify-plugin'
import prisma from '../lib/prisma.js'

//fp() makes the declaration available outside the plugin's scope (no encapsulation)

async function prismaPlugin(fastify) {
    fastify.decorate('prisma', prisma)

    fastify.addHook('onClose', async() => {
        await prisma.$disconnect()
    })
}

export default fp(prismaPlugin)