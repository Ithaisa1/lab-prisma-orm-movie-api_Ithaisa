# Instrucciones de Configuración - Lab Prisma ORM

## Pasos para completar la configuración

Debido a limitaciones del entorno, necesitas ejecutar los siguientes comandos manualmente en tu terminal:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia el archivo `.env.example` a `.env` y actualiza las credenciales:
```bash
copy .env.example .env
```
Luego edita `.env` con tus credenciales reales de PostgreSQL:
- `DATABASE_URL`: Tu conexión a PostgreSQL (asegúrate de que la base de datos `peliculas_db` existe)
- `JWT_SECRET`: Una cadena secreta para firmar tokens JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración del token (por defecto 24h)
- `PORT`: Puerto del servidor (por defecto 3000)

### 3. Generar migraciones de Prisma
```bash
npx prisma migrate dev --name init
```

Esto creará todas las tablas en tu base de datos según el schema.

### 4. (Opcional) Ejecutar el seed para poblar la base de datos con datos de prueba
```bash
npx prisma db seed
```

### 5. Iniciar el servidor
```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

## Probar la API

### Registro de usuario
```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario Test",
    "email": "test@example.com",
    "password": "password123",
    "rol": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Listar películas (con paginación)
```bash
curl "http://localhost:3000/api/peliculas?page=1&limit=5"
```

### Filtrar por género
```bash
curl "http://localhost:3000/api/peliculas?genero=ciencia-ficcion"
```

### Obtener película por ID (con relaciones y actores)
```bash
curl http://localhost:3000/api/peliculas/1
```

### Crear película (requiere token de admin)
```bash
curl -X POST http://localhost:3000/api/peliculas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "titulo": "Everything Everywhere All at Once",
    "anio": 2022,
    "nota": 7.8,
    "director": "Daniel Kwan",
    "genero": "ciencia-ficcion"
  }'
```

### Actualizar película
```bash
curl -X PUT http://localhost:3000/api/peliculas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "titulo": "Inception (Actualizada)",
    "nota": 9.0
  }'
```

### Eliminar película (soft delete)
```bash
curl -X DELETE http://localhost:3000/api/peliculas/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Prisma Studio
Para explorar la base de datos visualmente:
```bash
npx prisma studio
```
Abre `http://localhost:5555` en tu navegador.

## Verificación de la migración
Para verificar que las tablas se crearon correctamente, conecta a PostgreSQL:
```sql
\c peliculas_db
\dt
```

Deberías ver las siguientes tablas:
- actores
- directores
- generos
- peliculas
- pelicula_actores
- resenas
- favoritos
- usuarios

## Características Bonus Implementadas

### 1. Soft Delete
Las películas no se eliminan físicamente de la base de datos. En su lugar, se marca el campo `deletedAt` con la fecha de eliminación. El endpoint `GET /api/peliculas` automáticamente filtra las películas con `deletedAt != null`.

### 2. Seed con Prisma
El archivo `prisma/seed.js` pobla la base de datos con:
- 2 usuarios (admin y usuario regular)
- 5 directores
- 5 géneros
- 8 películas (algunas marcadas como destacadas)
- 8 actores
- Relaciones película-actor con nombres de personajes
- 4 reseñas de ejemplo
- 2 favoritos de ejemplo

### 3. Relaciones Many-to-Many
Se implementó la relación muchos-a-muchos entre Películas y Actores mediante la tabla `pelicula_actores`, que incluye:
- `peliculaId`: ID de la película
- `actorId`: ID del actor
- `personaje`: Nombre del personaje interpretado (opcional)

El endpoint `GET /api/peliculas/:id` ahora incluye el reparto de actores con sus personajes.
