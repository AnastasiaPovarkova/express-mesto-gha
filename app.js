const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

const { login, createUser } = require('./controllers/users');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '643d52c6e89b7adae40af226',
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена.' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
