const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, aboutUser, getUserById, updateUserInfo, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', aboutUser);
router.get('/:userId', getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateAvatar);

module.exports = router;
