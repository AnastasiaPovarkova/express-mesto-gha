const token = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return res.status(401).send({ message: 'Нет jwt' });
  }

  let payload;

  try {
    payload = token.verify(jwt, 'super-strong-secret');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
