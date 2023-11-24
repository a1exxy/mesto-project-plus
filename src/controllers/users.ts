import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import { updateOptions } from '../utils/utils';
import { expires, saltSize, secret } from '../config';
import CustomError from '../utils/customError';
import { RequestWithUser } from '../utils/types';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return user.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        return next(new CustomError(404, `Пользователь с _id = ${userId} не найден`));
      }
    })
    .catch((err:any) => next(err));
};

export const getMe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  return user.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        return next(new CustomError(404, `Пользователь с _id = ${userId} не найден`));
      }
    })
    .catch((err:any) => next(err));
};

export const getUsers = (_req: Request, res: Response, next: NextFunction) => user.find({})
  .then((out) => res.send(out))
  .catch((err:any) => next(err));

export const updateProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { name, about } = req.body;
  return user.findByIdAndUpdate(
    userId,
    { name, about },
    updateOptions,
  )
    // eslint-disable-next-line consistent-return
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        return next(new CustomError(404, `Пользователь с _id = ${userId} не найден`));
      }
    })
    .catch((err:any) => next(err));
};

export const updateAvatar = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { avatar } = req.body;
  return user.findByIdAndUpdate(userId, { avatar }, updateOptions)
    // eslint-disable-next-line consistent-return
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        return next(new CustomError(404, `Пользователь с _id = ${userId} не найден`));
      }
    })
    .catch(next);
};

export const createUser = async (req: Request, res: Response, next:NextFunction) => bcrypt
  .hash(req.body.password, saltSize)
  .then((hash) => user.create(
    {
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    },
  )
    .then((out: any) => res.status(200).send(out)))
  .catch((err: any) => {
    if (err.code === 11000) {
      return next(new CustomError(409, 'Почта уже существует'));
    }
    return next(err);
  });

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return user.checkCredentials(email, password)
    .then((out) => {
      res
        .status(200)
        .cookie(
          'authorization',
          jwt.sign({ _id: out._id }, secret, { expiresIn: expires }),
          { maxAge: expires * 1000, httpOnly: true, secure: true },
        )
        .send();
    })
    .catch(next);
};
