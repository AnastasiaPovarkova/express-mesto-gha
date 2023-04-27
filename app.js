const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена.' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
