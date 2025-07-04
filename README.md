# 🛍️ Tienda de Ropa - Proyecto MongoDB

Este repositorio contiene el desarrollo del primer proyecto para el curso **Desarrollo con Plataformas Abiertas** de la **Universidad Florencio del Castillo**. El objetivo es implementar una base de datos no relacional para una tienda de ropa, utilizando MongoDB y operando sobre varias colecciones con datos simulados.

## 👨‍🏫 Información del curso

- **Curso**: Desarrollo con Plataformas Abiertas  
- **Profesor**: Daniel Bogarín Granados  
- **Estudiante**: Eduardo Peraza
- **Cuatrimestre**: II Cuatrimestre, 2025  
- **Universidad**: Universidad Florencio del Castillo  

## ⚙️ Tecnologías utilizadas

- MongoDB
- Node.js
- JavaScript
- GitHub
- Formato Markdown (`.md`)

## 🧱 Estructura del Proyecto

📦 tienda-ropa-mongodb
┣ 📂 database
┃ ┗ 📄 database.js
┣ 📄 README.md


## 🗃️ Colecciones en la base de datos

1. `usuarios`: contiene la información de los clientes.
2. `marcas`: contiene las marcas de las prendas.
3. `prendas`: describe las prendas disponibles.
4. `ventas`: registra las transacciones de compra.

## 🔍 Ejemplos de documentos JSON

### 📁 Colección: `usuarios`
```json
{
  "nombre": "Andrea Vargas",
  "correo": "andrea.vargas@gmail.com",
  "direccion": "Cartago, Costa Rica",
  "tipoCliente": "frecuente"
}
📁 Colección: marcas
{
  "nombreMarca": "Zara",
  "pais": "España",
  "anioFundacion": 1975
}
📁 Colección: prendas
{
  "nombre": "Camiseta básica",
  "tipo": "camiseta",
  "marca_id": "ObjectId('665cbf2f5d654a0a9c123456')",
  "talla": "M",
  "precio": 10900,
  "stock": 25
}
📁 Colección: ventas
{
  "usuario_id": "ObjectId('665cbf2f5d654a0a9c654321')",
  "prenda_id": "ObjectId('665cbf2f5d654a0a9c789012')",
  "fecha": "2025-06-15",
  "cantidad": 2
}
