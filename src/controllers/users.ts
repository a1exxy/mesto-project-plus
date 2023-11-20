import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import { updateOptions } from '../utils/utils';
import { expires, saltSize, secret } from '../config';
import CustomError from '../utils/customError';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return user.findById(userId)
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        next(new CustomError(404, `Пользователь с _id = ${userId} не найден`));
      }
    })
    .catch((err:any) => next(err));
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const { _id: userId } = req.user;
  return user.findById(userId)
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        next(new CustomError(404, `Пользователь с _id = ${userId} не найден`));
      }
    })
    .catch((err:any) => next(err));
};

export const getUsers = (_req: Request, res: Response, next: NextFunction) => user.find({})
  .then((out) => res.send(out))
  .catch((err:any) => next(err));

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
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
        next(new CustomError(404, `Пользователь с _id = ${userId} не найден`));
      }
    })
    .catch((err:any) => next(err));
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const { _id: userId } = req.user;
  const { avatar } = req.body;
  return user.findByIdAndUpdate(userId, { avatar }, updateOptions)
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        next(new CustomError(404, `Пользователь с _id = ${userId} не найден`));
      }
    })
    .catch((err:any) => next(err));
};

// eslint-disable-next-line max-len
export const createUser = async (req: Request, res: Response, next:NextFunction) => user
  .findOne({ email: req.body.email })
  // eslint-disable-next-line consistent-return
  .then((item: any) => {
    if (!item) {
      return bcrypt.hash(req.body.password, saltSize)
        .then((hash) => user.create(
          {
            name: req.body.name,
            about: req.body.about,
            avatar: req.body.avatar,
            email: req.body.email,
            password: hash,
          },
        )
          // eslint-disable-next-line no-underscore-dangle
          .then((out: any) => res.status(200).send(out)))
        .catch((err: any) => next(err));
    }
    next(new CustomError(409, 'Почта уже существует'));
  });

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let userId: string = '';
  return user.findOne({ email }).select('_id, +password')
    .then((out:any) => {
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
      const { _id } = out;
      userId = String(_id);
      if (!out) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        next(new CustomError(401, 'Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, out!.password);
    })
    // eslint-disable-next-line consistent-return
    .then((matched: boolean) => {
      if (!matched) {
        next(new CustomError(401, 'Неправильные почта или пароль'));
      } else {
        return res
          .status(200)
          .cookie(
            'authorization',
            jwt.sign({ _id: userId }, secret, { expiresIn: expires }),
            { maxAge: expires * 1000, httpOnly: true, secure: true },
          )
          .send();
      }
    })
    .catch((err:any) => next(new CustomError(401, err.message)));
};
