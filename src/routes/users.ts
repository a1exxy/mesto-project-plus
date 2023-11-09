import express from 'express';
import {
  createUser,
  getUser,
  getUsers,
  updateAvatar,
  updateProfile,
} from '../controllers/users';

const usersRouter = express.Router();
export default usersRouter
  // GET /users — возвращает всех пользователей
  .get('/users', getUsers)

  // GET /users/:userId - возвращает пользователя по _id
  .get('/users/:userId', getUser)

  // POST /users — создаёт пользователя
  .post('/users', createUser)

  // PATCH /users/me — обновляет профиль
  .patch('/users/me', updateProfile)

  // PATCH /users/me/avatar — обновляет аватар
  .patch('/users/me/avatar', updateAvatar);
