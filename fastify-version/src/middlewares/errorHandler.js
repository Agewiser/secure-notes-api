export function errorHandler (error, request, reply) {
//Log the error server-side
    request.log.error(error)

    const statusCode = error.statusCode || 500

    //In production, dont leak internal errror messages. Very impo

        const message = process.env.NODE_ENV ==='production' && statusCode === 500? 'Internal Server Error'
        : error.message

        return code(statusCode).send({ error: message })
}


export default errorHandler