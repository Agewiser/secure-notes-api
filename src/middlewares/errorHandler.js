const isProd = process.env.NODE_ENV === 'production'

const prismaErrors = {
  P2002: { status: 409, message: 'A record with this value already exists' },
  P2025: { status: 404, message: 'Record not found' },
  P2003: { status: 400, message: 'Invalid reference — related record does not exist' },
  P2014: { status: 400, message: 'Invalid data provided' },
}

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  error.status = 404
  next(error)
}

export const errorHandler = (err, req, res, next) => {
  console.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  })

  if (err.constructor?.name === 'PrismaClientKnownRequestError') {
    const known = prismaErrors[err.code]
    if (known) {
      return res.status(known.status).json({ error: known.message })
    }
  }

  if (err.constructor?.name === 'PrismaClientValidationError') {
    return res.status(400).json({ error: 'Invalid data submitted' })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' })
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message })
  }

  res.status(500).json({
    error: isProd ? 'Something went wrong' : err.message,
    ...(!isProd && { stack: err.stack }),
  })
}