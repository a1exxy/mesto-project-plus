import { Request, Response } from 'express';
import user from '../models/user';
import { updateOptions } from '../utils';

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
    .catch((err) => res.status(400).send(err));
};

export const getUsers = (req: Request, res: Response) => user.find({})
  .then((out) => res.send(out))
  .catch((err) => res.status(400).send(err));

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
    .catch((err) => res.status(400).send(err));
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
    .catch((err) => res.status(400).send(err));
};

export const createUser = (req: Request, res: Response) => user.create({
  name: req.body.name,
  about: req.body.about,
  avatar: req.body.avatar,
})
  .then((out) => res.send(out))
  .catch((err) => res.status(400).send(err));
