const { ObjectId } = require('mongodb');
const { connect } = require('../connect');

module.exports = {
  getProducts: async (req, resp, next) => {
    // TODO: Implementa la función necesaria para traer la colección `users`
    try {
      // conexion a la base de datos
      const db = await connect();

      // obtener colección 'productos'
      const productsCollection = db.collection('products');

      // realizo la consulta para obtener los productos
      const products = await productsCollection.find().toArray();
      console.log("consigue los productos");
      // responder con las lista de productos
      resp.status(200).json({ products });
    } catch (error) {
      next();
    }
  },
  getProductId: async (req, resp) => {
    try {
      const { productId } = req.params;

      const db = await connect();
      const productsCollection = db.collection('products');

      const _id = new ObjectId(productId);
      const productsId = await productsCollection.findOne({ _id });

      console.log('consigue el id de producto');
      resp.status(200).json({ productsId });
    } catch (error) {
      resp.status(404).json({
        error: 'Usuario no encontrado',
      });

      console.log('no esta bien el id');
    }
  },
  postProducts: async (req, resp, next) => {
    try {
      const {
        name, price, image, type,
      } = req.body;

      // conexion a la base de datos
      const db = await connect();

      // obtener colección 'productos'
      const productsCollection = db.collection('products');

      // Crear el objeto de credenciales para el nuevo producto
      const dataProduct = {
        name,
        price,
        image,
        type,
        dateEntry: new Date(),
      };
      const productPost = await productsCollection.insertOne(dataProduct);
      console.log("producto nuevo en base de datos");
      resp.status(200).json({
        id: productPost.insertedId,
        name,
        price,
        image,
        type,
        dateEntry: dataProduct.dateEntry,
      });
    } catch (error) {
      next(error);
    }
  },
};
