const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { connect } = require('../connect');

module.exports = {
  getUsers: async (req, resp, next) => {
    // TODO: Implementa la función necesaria para traer la colección `users`
    try {
      // conexion a la base de datos
      const db = await connect();

      // obtener colección 'users'
      const usersCollection = db.collection('users');

      // realizo la consulta para obtener los usuarios
      const users = await usersCollection.find().toArray();
      console.log('consigue los usuarios');
      // responder con las lista de usuarios
      resp.status(200).json({ users });
    } catch (error) {
      next();
    }
  },
  getUserId: async (req, resp) => {
    try {
      const { uid } = req.params;

      const db = await connect();
      const usersCollection = db.collection('users');

      const _id = new ObjectId(uid);
      const userId = await usersCollection.findOne({ _id });

      console.log('consigue el id');
      resp.status(200).json({
        id: userId._id,
        email: userId.email,
        role: userId.role,
      });
    } catch (error) {
      resp.status(404).json({
        error: 'Usuario no encontrado',
      });

      console.log('no esta bien el id');
    }
  },
  patchUserId: async (req, resp, next) => {
    try {
      const { uid } = req.params; // Obtener el ID del usuario de los parámetros de la ruta
      const updatedData = req.body; // Obtener los datos actualizados del cuerpo de la solicitud

      const db = await connect();
      const usersCollection = db.collection('users');

      const _id = new ObjectId(uid);

      // Si se proporciona una nueva contraseña en los datos actualizados, encriptarla
      if (updatedData.password) {
        const hashedPassword = bcrypt.hashSync(updatedData.password, 10);
        updatedData.password = hashedPassword;
      }

      const userPatchId = await usersCollection.findOneAndUpdate(
        { _id }, // Filtrar por el ID del usuario
        { $set: updatedData }, // Actualizar los campos proporcionados en updatedData
        { returnOriginal: false },
      );
      console.log('Usuario actualizado');
      resp.status(200).json({
        id: userPatchId.value._id,
        email: updatedData.email,
        role: updatedData.role,
      });
    } catch (error) {
      resp.status(404).json({
        error: 'Usuario no actualizado',
      });

      console.log('Usuario no actualizado');
    }
  },
  postUsers: async (req, resp, next) => {
    try {
      // Extraer datos del cuerpo de la solicitud
      const { email, password, role } = req.body;

      // Validar los datos (agrega validaciones según tus necesidades)

      // Hash de la contraseña
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Establecer la conexión a la base de datos
      const db = await connect();

      // Obtener la colección 'users'
      const usersCollection = db.collection('users');

      // Crear el objeto de credenciales para el nuevo usuario
      const credentials = {
        email,
        password: hashedPassword,
        role,
      };

      // Insertar el nuevo usuario en la base de datos
      const userPost = await usersCollection.insertOne(credentials);
      console.log('usuario nuevo en base de datos');

      resp.status(200).json({ Id: userPost.insertedId, email, role });
    } catch (error) {
      next(error);
    }
  },
  deleteUserId: async (req, resp, next) => {
    try {
      const { uid } = req.params;

      const db = await connect();
      const usersCollection = db.collection('users');

      const _id = new ObjectId(uid);

      const userDeleteId = await usersCollection.deleteOne({ _id });

      console.log('Usuario eliminado');

      resp.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      resp.status(404).json({
        error: 'Usuario no eliminado',
      });

      console.log('Usuario no eliminado');
    }
  },
};
