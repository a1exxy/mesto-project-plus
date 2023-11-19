import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getMe,
  getUser,
  getUsers,
  updateAvatar,
  updateProfile,
} from '../controllers/users';
import {
  aboutFormat,
  linkFormat,
  nameFormat,
  userIdFormat,
} from '../utils';

const usersRouter = express.Router();
export default usersRouter
  // GET /users — возвращает всех пользователей
  .get('/', getUsers)
  //  возвращает информацию о текущем пользователе
  .get('/me', getMe)
  // GET /users/:userId - возвращает пользователя по _id
  .get('/:userId', celebrate({
    params: userIdFormat,
  }), getUser)
  // PATCH /users/me — обновляет профиль
  .patch('/me', celebrate({
    body: Joi.object().keys({
      name: nameFormat.required(),
      about: aboutFormat.required(),
    }),
  }), updateProfile)
  // PATCH /users/me/avatar — обновляет аватар
  .patch('/me/avatar', celebrate({
    body: Joi.object().keys({
      avatar: linkFormat.required(),
    }),
  }), updateAvatar);
