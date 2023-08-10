const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    // if (!decodedToken.userId) {
    //   return next(403);
    // }

    // agrega id del usuario al objeto req para que los siguientes middlewares puedan acceder a él
    req.userId = decodedToken.userId;
    req.role = decodedToken.role;
    req.email = decodedToken.email;
    //  console.log(req.userId);

    // Llama a `next()` para pasar al siguiente middleware
    next();
  });
};

module.exports.isAuthenticated = (req) => (
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  !!req.userId

  // false
);

module.exports.isAdmin = (req) => (
  // TODO: decidir por la informacion del request si la usuaria es admin
  req.role === 'admin'
  // false
);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()

);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()

);
