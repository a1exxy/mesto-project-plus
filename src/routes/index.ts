import express, { Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  aboutFormat,
  emailFormat,
  linkFormat,
  nameFormat,
  userPasswdFormat,
} from '../utils/validation';
import { createUser, login } from '../controllers/users';
import cardsRoutes from './cards';
import usersRoutes from './users';
import auth from '../middlewares/auth';
import CustomError from '../utils/customError';

const router = express.Router();

export default router
  // Логин
  .post('/signin', celebrate({
    body: Joi.object().keys({
      email: emailFormat,
      password: userPasswdFormat,
    }),
  }), login)
  // Создание пользователя
  .post('/signup', celebrate({
    body: Joi.object().keys({
      name: nameFormat,
      about: aboutFormat,
      avatar: linkFormat,
      email: emailFormat,
      password: userPasswdFormat,
    }),
  }), createUser)
  // Проверка токенов
  .use(auth)
  // Ручки карточек
  .use('/cards', cardsRoutes)
  // Ручки пользователей
  .use('/users', usersRoutes)
  // Default path
  .use((req: Request, res: Response, next: NextFunction) => {
    next(new CustomError(404, 'Путь не найден'));
  });
