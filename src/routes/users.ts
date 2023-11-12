import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUser,
  getUsers,
  updateAvatar,
  updateProfile,
} from '../controllers/users';
import { linkFormat, nameFormat, userIdFormat } from '../utils';

const usersRouter = express.Router();
export default usersRouter
  // GET /users — возвращает всех пользователей
  .get('/users', getUsers)

  // GET /users/:userId - возвращает пользователя по _id
  .get('/users/:userId', celebrate({
    params: userIdFormat,
  }), getUser)
  //  возвращает информацию о текущем пользователе
  .get('/users/me', ()=>{}) // TODO доделать

  // PATCH /users/me — обновляет профиль
  .patch('/users/me', celebrate({
    body: Joi.object().keys({
      name: nameFormat.required(),
      about: linkFormat.required(),
    }),
  }), updateProfile)

  // PATCH /users/me/avatar — обновляет аватар
  .patch('/users/me/avatar', celebrate({
    body: Joi.object().keys({
      avatar: linkFormat.required(),
    }),
  }), updateAvatar);
