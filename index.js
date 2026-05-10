require('dotenv').config()
const express = require('express')
const cors = require('cors')

const peliculasRoutes = require('./src/routes/peliculas')
const authRoutes = require('./src/routes/auth')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/peliculas', peliculasRoutes)
app.use('/api/auth', authRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message || 'Error interno del servidor'
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
