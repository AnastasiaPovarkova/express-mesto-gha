const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { urlRegular } = require('../config/constants');
const centralizedErrorHandler = require('../middlewares/centralizedErrorHandler');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegular),
  }),
}), createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

router.use(errors()); // обработчик ошибок celebrate

router.use(centralizedErrorHandler); // центральный обработчик ошибок

module.exports = router;
