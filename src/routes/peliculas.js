const express = require('express')
const router = express.Router()
const {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula
} = require('../controllers/peliculasPrismaController')

// GET /api/peliculas
router.get('/', listarPeliculas)

// GET /api/peliculas/:id
router.get('/:id', obtenerPelicula)

// POST /api/peliculas
router.post('/', crearPelicula)

// PUT /api/peliculas/:id
router.put('/:id', actualizarPelicula)

// DELETE /api/peliculas/:id
router.delete('/:id', eliminarPelicula)

module.exports = router