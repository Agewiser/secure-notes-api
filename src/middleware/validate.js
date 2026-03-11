export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    if(!result.success) {
        const errors = result.error.flatten().fieldErrors
        return res.status(400).json ({
            error: 'validation failed',
            fields: errors,
        })
    }

    req.body = result.data
    next()

}
export const validateParams = (schema) => (req, res, next) => {
    const result = schema.safeParse (req.params)

    if (!result.success) {
        return res.status (400).json ({
            error: 'Invalid request parameters',
        })
    }
    req.params = result.data
    next ()
}