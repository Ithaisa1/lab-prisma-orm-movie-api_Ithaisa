const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Limpiar datos existentes
  await prisma.peliculaActor.deleteMany()
  await prisma.actor.deleteMany()
  await prisma.resena.deleteMany()
  await prisma.favorito.deleteMany()
  await prisma.pelicula.deleteMany()
  await prisma.genero.deleteMany()
  await prisma.director.deleteMany()
  await prisma.usuario.deleteMany()

  console.log('🧹 Datos limpiados')

  // Crear usuarios
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Admin',
      email: 'admin@example.com',
      passwordHash: '$2b$10$K7qZ9Y8XWvRzJmNnKpLqOeXhYiZjKlMnOpQrStUvWxYzA1B2C3D4E5F6G7H8I9J0',
      rol: 'admin'
    }
  })

  const usuario = await prisma.usuario.create({
    data: {
      nombre: 'Usuario Test',
      email: 'usuario@example.com',
      passwordHash: '$2b$10$K7qZ9Y8XWvRzJmNnKpLqOeXhYiZjKlMnOpQrStUvWxYzA1B2C3D4E5F6G7H8I9J0',
      rol: 'usuario'
    }
  })

  console.log('👤 Usuarios creados')

  // Crear directores
  const directores = await prisma.director.createMany({
    data: [
      { nombre: 'Christopher Nolan' },
      { nombre: 'Quentin Tarantino' },
      { nombre: 'Martin Scorsese' },
      { nombre: 'Steven Spielberg' },
      { nombre: 'Denis Villeneuve' }
    ]
  })

  console.log('🎬 Directores creados')

  // Crear géneros
  const generos = await prisma.genero.createMany({
    data: [
      { nombre: 'Ciencia Ficción', slug: 'ciencia-ficcion' },
      { nombre: 'Drama', slug: 'drama' },
      { nombre: 'Acción', slug: 'accion' },
      { nombre: 'Thriller', slug: 'thriller' },
      { nombre: 'Comedia', slug: 'comedia' }
    ]
  })

  console.log('🎭 Géneros creados')

  // Obtener directores y géneros creados
  const nolan = await prisma.director.findUnique({ where: { nombre: 'Christopher Nolan' } })
  const tarantino = await prisma.director.findUnique({ where: { nombre: 'Quentin Tarantino' } })
  const scorsese = await prisma.director.findUnique({ where: { nombre: 'Martin Scorsese' } })
  const spielberg = await prisma.director.findUnique({ where: { nombre: 'Steven Spielberg' } })
  const villeneuve = await prisma.director.findUnique({ where: { nombre: 'Denis Villeneuve' } })

  const sciFi = await prisma.genero.findUnique({ where: { slug: 'ciencia-ficcion' } })
  const drama = await prisma.genero.findUnique({ where: { slug: 'drama' } })
  const accion = await prisma.genero.findUnique({ where: { slug: 'accion' } })
  const thriller = await prisma.genero.findUnique({ where: { slug: 'thriller' } })

  // Crear películas
  const peliculas = await prisma.pelicula.createMany({
    data: [
      {
        titulo: 'Inception',
        anio: 2010,
        nota: 8.8,
        directorId: nolan.id,
        generoId: sciFi.id,
        destacada: true
      },
      {
        titulo: 'Pulp Fiction',
        anio: 1994,
        nota: 8.9,
        directorId: tarantino.id,
        generoId: drama.id,
        destacada: true
      },
      {
        titulo: 'The Dark Knight',
        anio: 2008,
        nota: 9.0,
        directorId: nolan.id,
        generoId: accion.id,
        destacada: true
      },
      {
        titulo: 'Goodfellas',
        anio: 1990,
        nota: 8.7,
        directorId: scorsese.id,
        generoId: drama.id
      },
      {
        titulo: 'Dune',
        anio: 2021,
        nota: 8.0,
        directorId: villeneuve.id,
        generoId: sciFi.id,
        destacada: true
      },
      {
        titulo: 'Schindler\'s List',
        anio: 1993,
        nota: 9.0,
        directorId: spielberg.id,
        generoId: drama.id,
        destacada: true
      },
      {
        titulo: 'Interstellar',
        anio: 2014,
        nota: 8.6,
        directorId: nolan.id,
        generoId: sciFi.id
      },
      {
        titulo: 'Kill Bill: Volume 1',
        anio: 2003,
        nota: 8.1,
        directorId: tarantino.id,
        generoId: accion.id
      }
    ]
  })

  console.log('🎥 Películas creadas')

  // Crear actores
  const actores = await prisma.actor.createMany({
    data: [
      { nombre: 'Leonardo DiCaprio' },
      { nombre: 'Brad Pitt' },
      { nombre: 'Tom Hanks' },
      { nombre: 'Meryl Streep' },
      { nombre: 'Robert De Niro' },
      { nombre: 'Al Pacino' },
      { nombre: 'Natalie Portman' },
      { nombre: 'Timothée Chalamet' }
    ]
  })

  console.log('🎭 Actores creados')

  // Obtener actores y películas
  const leo = await prisma.actor.findUnique({ where: { nombre: 'Leonardo DiCaprio' } })
  const brad = await prisma.actor.findUnique({ where: { nombre: 'Brad Pitt' } })
  const tom = await prisma.actor.findUnique({ where: { nombre: 'Tom Hanks' } })
  const meryl = await prisma.actor.findUnique({ where: { nombre: 'Meryl Streep' } })
  const robert = await prisma.actor.findUnique({ where: { nombre: 'Robert De Niro' } })

  const inception = await prisma.pelicula.findFirst({ where: { titulo: 'Inception' } })
  const pulp = await prisma.pelicula.findFirst({ where: { titulo: 'Pulp Fiction' } })
  const darkKnight = await prisma.pelicula.findFirst({ where: { titulo: 'The Dark Knight' } })
  const goodfellas = await prisma.pelicula.findFirst({ where: { titulo: 'Goodfellas' } })
  const schindler = await prisma.pelicula.findFirst({ where: { titulo: 'Schindler\'s List' } })

  // Crear relaciones película-actor
  await prisma.peliculaActor.createMany({
    data: [
      { peliculaId: inception.id, actorId: leo.id, personaje: 'Cobb' },
      { peliculaId: inception.id, actorId: tom.id, personaje: 'Professor' },
      { peliculaId: pulp.id, actorId: brad.id, personaje: 'Stuntman Mike' },
      { peliculaId: pulp.id, actorId: robert.id, personaje: 'Jimmy' },
      { peliculaId: darkKnight.id, actorId: leo.id, personaje: 'Joker' },
      { peliculaId: goodfellas.id, actorId: robert.id, personaje: 'Jimmy Conway' },
      { peliculaId: goodfellas.id, actorId: await prisma.actor.findUnique({ where: { nombre: 'Al Pacino' } }).then(a => a.id), personaje: 'Frank' },
      { peliculaId: schindler.id, actorId: liam = await prisma.actor.create({ data: { nombre: 'Liam Neeson' } }).then(a => a.id), personaje: 'Oskar Schindler' }
    ]
  })

  console.log('🎬 Relaciones película-actor creadas')

  // Crear reseñas
  await prisma.resena.createMany({
    data: [
      {
        peliculaId: inception.id,
        autor: 'Cinefilo123',
        texto: 'Una obra maestra del cine de ciencia ficción. Nolan demuestra su genio otra vez.',
        puntuacion: 10
      },
      {
        peliculaId: inception.id,
        autor: 'MovieLover',
        texto: 'Increíblemente compleja y satisfactoria. La mejor película de la década.',
        puntuacion: 9
      },
      {
        peliculaId: pulp.id,
        autor: 'TarantinoFan',
        texto: 'El diálogo es brillante. Una película que cambió el cine para siempre.',
        puntuacion: 10
      },
      {
        peliculaId: darkKnight.id,
        autor: 'BatmanFan',
        texto: 'Heath Ledger como Joker es legendario. La mejor película de superhéroes.',
        puntuacion: 10
      }
    ]
  })

  console.log('📝 Reseñas creadas')

  // Crear favoritos
  await prisma.favorito.create({
    data: {
      usuarioId: usuario.id,
      peliculaId: inception.id
    }
  })

  await prisma.favorito.create({
    data: {
      usuarioId: usuario.id,
      peliculaId: pulp.id
    }
  })

  console.log('❤️ Favoritos creados')

  console.log('✅ Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
