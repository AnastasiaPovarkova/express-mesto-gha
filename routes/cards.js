const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/(http|https):\/\/(\w+:{0,1}\w*#)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&amp;%#!\-/]))?/),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
}), deleteCardById);
router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
}), dislikeCard);

module.exports = router;
