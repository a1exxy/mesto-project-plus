import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import { updateOptions } from '../utils';

require('dotenv').config();

const expires = Number(process.env.SESSION_EXPIRES);
const secret = process.env.SECRET!;
const saltSize = Number(process.env.SALT_SIZE);

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  return user.findById(userId)
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        res.status(404).send({ error: `Пользователь с _id = ${userId} не найден` });
      }
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

export const getUsers = (req: Request, res: Response) => user.find({})
  .then((out) => res.send(out))
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));

export const updateProfile = async (req: Request, res: Response) => {
  // @ts-ignore
  const { _id: userId } = req.user;
  const { name, about } = req.body;

  return user.findByIdAndUpdate(
    userId,
    { name, about },
    updateOptions,
  )
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        res.status(404).send({ error: `Пользователь с _id = ${userId} не найден` });
      }
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

export const updateAvatar = async (req: Request, res: Response) => {
  // @ts-ignore
  const { _id: userId } = req.user;
  const { avatar } = req.body;
  return user.findByIdAndUpdate(userId, { avatar }, updateOptions)
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        res.status(404).send({ error: `Пользователь с _id = ${userId} не найден` });
      }
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => bcrypt.hash(req.body.password, saltSize)
  .then((hash) => user.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
    email: req.body.email,
    password: hash,
  }))
  .then((out) => res.status(200).send(out))
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  let userId: string = '';
  return user.findOne({ email }).select('_id, +password')
    .then((out) => {
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
      const { _id } = out;
      userId = String(_id);
      if (!out) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, out.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return res
        .status(200)
        .cookie(
          'authorization',
          jwt.sign({ _id: userId }, secret, { expiresIn: expires }),
          { maxAge: expires * 1000, httpOnly: true, secure: true },
        )
        .send();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message, extMsg: err });
    });
};
