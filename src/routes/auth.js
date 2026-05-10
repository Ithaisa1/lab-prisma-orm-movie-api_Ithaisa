const express = require('express')
const router = express.Router()
const { registro, login } = require('../controllers/authController')

// POST /api/auth/registro
router.post('/registro', registro)

// POST /api/auth/login
router.post('/login', login)

module.exports = router
