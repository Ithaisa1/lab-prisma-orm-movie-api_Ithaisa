# Notas de Reflexión - Lab Prisma ORM

## 1. ¿Qué ventajas concretas ofrece Prisma frente a escribir SQL en crudo en este proyecto?

Prisma ofrece varias ventajas significativas en este proyecto:

### a) Type Safety y Autocompletado
Con Prisma Client, obtenemos autocompletado de TypeScript/JavaScript en todo el código. Por ejemplo, al escribir `prisma.pelicula.`, el IDE nos muestra todos los métodos disponibles (`findMany`, `create`, `update`, etc.) y al acceder a las relaciones, automáticamente nos sugiere los campos relacionados como `director`, `genero`, `resenas`. Esto reduce errores de escritura y hace el desarrollo mucho más rápido y seguro.

### b) Gestión Automática de Relaciones
En lugar de escribir JOINs complejos manualmente, Prisma maneja las relaciones automáticamente. Por ejemplo, para obtener una película con su director, género y reseñas, simplemente usamos:
```javascript
const pelicula = await prisma.pelicula.findUnique({
  where: { id },
  include: { director: true, genero: true, resenas: true }
})
```
Esto es mucho más limpio y mantenible que escribir SQL manual con múltiples JOINs. Además, Prisma genera automáticamente las foreign keys y maneja la integridad referencial.

### c) Transacciones Simplificadas
Prisma ofrece dos tipos de transacciones que son mucho más fáciles de usar que en SQL crudo:
- `prisma.$transaction([query1, query2])` para ejecutar queries en paralelo
- `prisma.$transaction(async (tx) => { ... })` para transacciones secuenciales con lógica compleja

Esto permite encapsular lógica de negocio compleja dentro de transacciones sin tener que escribir SQL de transacción manual.

## 2. ¿Qué hace `prisma.$transaction([query1, query2])`? ¿En qué se diferencia de `prisma.$transaction(async (tx) => { ... })`?

### `prisma.$transaction([query1, query2])`
Este tipo de transacción ejecuta múltiples operaciones de Prisma en **paralelo** dentro de una transacción de base de datos. Es ideal cuando necesitas ejecutar varias operaciones independientes atómicamente. Por ejemplo:

```javascript
const [peliculas, total] = await prisma.$transaction([
  prisma.pelicula.findMany({ where, skip, take }),
  prisma.pelicula.count({ where })
])
```

**Características:**
- Ejecuta las queries en paralelo (más rápido)
- Todas las queries deben ser operaciones de Prisma independientes
- Si alguna falla, todas se rollback
- No permite lógica condicional entre queries

### `prisma.$transaction(async (tx) => { ... })`
Este tipo de transacción ejecuta operaciones **secuenciales** dentro de una transacción, permitiendo lógica condicional compleja entre operaciones. Es ideal cuando necesitas usar el resultado de una operación en la siguiente. Por ejemplo:

```javascript
const pelicula = await prisma.$transaction(async (tx) => {
  let directorId = null
  if (director) {
    const directorRecord = await tx.director.upsert({
      where: { nombre: director },
      update: {},
      create: { nombre: director }
    })
    directorId = directorRecord.id
  }
  
  return tx.pelicula.create({
    data: { titulo, anio, directorId }
  })
})
```

**Características:**
- Ejecuta las queries secuencialmente (una tras otra)
- Permite lógica condicional y usar resultados de operaciones anteriores
- Todas las operaciones usan el mismo objeto `tx` (transaction client)
- Si alguna falla, todas se rollback
- Más flexible pero potencialmente más lento que el paralelo

## 3. ¿Qué archivo NO deberías commitear nunca al repositorio de tu schema de Prisma? ¿Y cuáles sí deben estar en el repositorio?

### Archivo que NO se debe commitear:
**`node_modules/@prisma/client/`** - Este directorio contiene el Prisma Client generado automáticamente. Nunca se debe commitear porque:
- Se regenera automáticamente con `npx prisma generate`
- Es específico de la plataforma y puede causar conflictos entre sistemas operativos
- Aumenta innecesariamente el tamaño del repositorio
- Se incluye en `.gitignore` por defecto

### Archivos que SÍ deben estar en el repositorio:
1. **`prisma/schema.prisma`** - El schema principal que define todos los modelos. Es la fuente de verdad de tu base de datos.
2. **`prisma/migrations/`** - El directorio de migraciones con todos los archivos SQL generados. Es crucial para:
   - Mantener un historial de cambios en la base de datos
   - Permitir que otros desarrolladores repliquen la misma estructura
   - Facilitar el despliegue en producción
   - Permitir rollback a versiones anteriores
3. **`.env.example`** (opcional pero recomendado) - Un template de las variables de entorno necesarias, sin los valores reales.

### Archivo `.env`:
El archivo `.env` con las credenciales reales **NO** se debe commitear por razones de seguridad. En su lugar, se debe commitear un `.env.example` como plantilla.
