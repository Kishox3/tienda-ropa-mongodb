// database/database.js
const { MongoClient, ObjectId } = require("mongodb");

const uri = "TU_URI_DE_CONEXIÓN_AQUÍ";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("tienda_ropa");

    const usuarios = db.collection("usuarios");
    const marcas = db.collection("marcas");
    const prendas = db.collection("prendas");
    const ventas = db.collection("ventas");

    // ------------------- INSERCIONES -------------------

    // Insertar un usuario
    await usuarios.insertOne({
      nombre: "Andrea Vargas",
      correo: "andrea.vargas@gmail.com",
      direccion: "Cartago",
      tipoCliente: "frecuente"
    });

    // Insertar varias marcas
    const marcasInsertadas = await marcas.insertMany([
      { nombreMarca: "Zara", pais: "España", anioFundacion: 1975 },
      { nombreMarca: "Nike", pais: "EE.UU.", anioFundacion: 1964 },
      { nombreMarca: "H&M", pais: "Suecia", anioFundacion: 1947 },
      { nombreMarca: "Levi's", pais: "EE.UU.", anioFundacion: 1853 },
      { nombreMarca: "Puma", pais: "Alemania", anioFundacion: 1948 }
    ]);

    // Insertar varias prendas
    const prendasInsertadas = await prendas.insertMany([
      {
        nombre: "Camiseta básica",
        tipo: "camiseta",
        marca_id: marcasInsertadas.insertedIds[0],
        talla: "M",
        precio: 10900,
        stock: 25
      },
      {
        nombre: "Jeans azul",
        tipo: "pantalón",
        marca_id: marcasInsertadas.insertedIds[1],
        talla: "32",
        precio: 22900,
        stock: 10
      }
    ]);

    // Insertar una venta
    await ventas.insertOne({
      usuario_id: ObjectId("665cbf2f5d654a0a9c654321"), // reemplazar con un ObjectId válido de usuarios
      prenda_id: prendasInsertadas.insertedIds[0],
      fecha: new Date("2025-06-15"),
      cantidad: 2
    });

    // ------------------- ACTUALIZAR -------------------
    await prendas.updateOne(
      { nombre: "Camiseta básica" },
      { $set: { stock: 23 } }
    );

    // ------------------- ELIMINAR -------------------
    await marcas.deleteOne({ nombreMarca: "Puma" });

    // ------------------- CONSULTAS -------------------

    // 1. Cantidad vendida por fecha específica
    // Obtener prendas vendidas el 15 de junio 2025
    const ventasPorFecha = await ventas.find({
      fecha: new Date("2025-06-15")
    }).toArray();
    console.log("Ventas por fecha:", ventasPorFecha);

    // 2. Marcas con al menos una venta
    const marcasConVentas = await ventas.aggregate([
      {
        $lookup: {
          from: "prendas",
          localField: "prenda_id",
          foreignField: "_id",
          as: "prenda"
        }
      },
      { $unwind: "$prenda" },
      {
        $lookup: {
          from: "marcas",
          localField: "prenda.marca_id",
          foreignField: "_id",
          as: "marca"
        }
      },
      { $unwind: "$marca" },
      {
        $group: {
          _id: "$marca._id",
          nombreMarca: { $first: "$marca.nombreMarca" }
        }
      }
    ]).toArray();
    console.log("Marcas con ventas:", marcasConVentas);

    // 3. Prendas vendidas y stock restante
    const prendasVendidasYStock = await ventas.aggregate([
      {
        $lookup: {
          from: "prendas",
          localField: "prenda_id",
          foreignField: "_id",
          as: "prenda"
        }
      },
      { $unwind: "$prenda" },
      {
        $group: {
          _id: "$prenda._id",
          nombre: { $first: "$prenda.nombre" },
          totalVendida: { $sum: "$cantidad" },
          stock: { $first: "$prenda.stock" }
        }
      }
    ]).toArray();
    console.log("Prendas vendidas y stock:", prendasVendidasYStock);

    // 4. Top 5 marcas más vendidas
    const topMarcas = await ventas.aggregate([
      {
        $lookup: {
          from: "prendas",
          localField: "prenda_id",
          foreignField: "_id",
          as: "prenda"
        }
      },
      { $unwind: "$prenda" },
      {
        $group: {
          _id: "$prenda.marca_id",
          totalVentas: { $sum: "$cantidad" }
        }
      },
      {
        $lookup: {
          from: "marcas",
          localField: "_id",
          foreignField: "_id",
          as: "marca"
        }
      },
      { $unwind: "$marca" },
      {
        $project: {
          nombreMarca: "$marca.nombreMarca",
          totalVentas: 1
        }
      },
      { $sort: { totalVentas: -1 } },
      { $limit: 5 }
    ]).toArray();
    console.log("Top 5 marcas más vendidas:", topMarcas);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

run();
