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
      const result = await usersCollection.insertOne(credentials);
      console.log('usuario nuevo en base de datos');

      resp.status(201).json({ Id: result.insertedId, email, role });
    } catch (error) {
      next(error);
    }
  },
};
