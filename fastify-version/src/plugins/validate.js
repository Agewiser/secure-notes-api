import fp from 'fastify-plugin'

//Returns a preHandler hook

export function validateBody(schema) {

    return async function (request, reply) {
    const result = schema.safeParse(request.body)
    if (!result.success) {
        return reply.code(400).send({
            error: 'Validation failed',
            details: result.error.flatten().fieldErrors
        })
    }
        //replace body with the parsed data
        request.body=result.data
    }
}