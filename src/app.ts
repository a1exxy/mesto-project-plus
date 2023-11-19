import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { celebrate, errors, Joi } from 'celebrate';
import 'dotenv/config';
import cardsRoutes from './routes/cards';
import usersRoutes from './routes/users';
import { createUser, login } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';
import auth from './middlewares/auth';
import {
  aboutFormat,
  emailFormat,
  linkFormat,
  nameFormat,
  userPasswdFormat,
} from './utils';
import CustomError from './customError';

const connectOptions = {
  dbName: process.env.DB_NAME,
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

// Проверка подключения к БД
mongoose.connect(`mongodb://${process.env.DB_CONN}`, connectOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, '[mongoose] Ошибка подключения: '));
db.once('open', () => {
  console.log('[mongoose] Подлючение установлено');
});

const app = express();
app.use(express.json());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: emailFormat,
    password: userPasswdFormat,
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: nameFormat,
    about: aboutFormat,
    avatar: linkFormat,
    email: emailFormat,
    password: userPasswdFormat,
  }),
}), createUser);

app.use(auth);

app.use('/cards', cardsRoutes);
app.use('/users', usersRoutes);

// Default path
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new CustomError(500, 'На сервере произошла ошибка'));
});

app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err: any, req: Request, res: Response) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
