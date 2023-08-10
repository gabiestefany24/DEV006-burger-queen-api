const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    // TODO: autenticar a la usuarix
    const client = new MongoClient(config.dbUrl);
    await client.connect();
    const db = client.db();

    // confirmar si el email y password coinciden con un user en la base de datos
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return next(400);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(400);
    }

    // Si coinciden, manda un access token creado con jwt
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: '1h' }, // Puedes ajustar el tiempo de expiración según tus necesidades
    );
    console.log(user.role);
    resp.status(200).json({ token });
    next();
  });

  return nextMain();
};
