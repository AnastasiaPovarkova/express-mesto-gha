const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById({ _id: req.params.userId })
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректно задан ID' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.status(201).cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message }); // ошибка аутентификации
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректно задан ID' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректно задан ID' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
