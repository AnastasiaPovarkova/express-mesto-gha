const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({
    name, link, owner: userId,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (!(req.user._id === cards.owner._id.toString())) {
        res.status(404).send({ message: 'Запрещено удалять чужие карточки' });
      } else {
        Card.findByIdAndRemove({ _id: req.params.cardId })
          .orFail(() => {
            throw new Error('Карточка не найдена');
          })
          .then((card) => res.send({ data: card }))
          .catch((err) => {
            if (err.name === 'CastError') {
              res.status(400).send({ message: 'Некорректно задан ID карточки' });
            } else if (err.message === 'Карточка не найдена') {
              res.status(404).send({ message: 'Карточка по указанному id не найдена' });
            } else {
              res.status(500).send({ message: 'Произошла ошибка' });
            }
          });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректно задан ID карточки' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(404).send({ message: 'Карточка по указанному id не найдена' });
      } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректно задан ID карточки' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(404).send({ message: 'Карточка по указанному id не найдена' });
      } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
