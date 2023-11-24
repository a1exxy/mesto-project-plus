import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import card from '../models/card';
import CustomError from '../utils/customError';
import { RequestWithUser } from '../utils/types';

export const getCards = (_req: Request, res: Response) => card.find({})
  .then((out) => res.send(out))
  .catch(() => new CustomError(500, 'На сервере произошла ошибка'));

export const deleteCard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  return card.findById(cardId)
    .then((item:any) => {
      if (!item) {
        throw new CustomError(404, 'Карточка не найдена');
      }
      if (String(item.owner) !== userId) {
        throw new CustomError(403, 'Чужая карточка');
      }
      return item.remove((out:any) => res.status(200).send(out));
    })
    .catch(next);
};

export const likeCard = async (req: RequestWithUser, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  return card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    { new: true },
  )
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        res.status(404).send({ error: `Карточка с _id = ${cardId} не найдена` });
      }
    })
    .catch(() => new CustomError(500, 'На сервере произошла ошибка'));
};

export const dislikeCard = async (req: RequestWithUser, res: Response) => {
  const { cardId } = req.params;
  return card.findByIdAndUpdate(
    cardId,
    {
      // @ts-ignore
      $pull: { likes: new mongoose.Types.ObjectId(req.user?._id) },
    },
    { new: true },
  )
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        res.status(404).send({ error: `Карточка с _id = ${cardId} не найдена` });
      }
    })
    .catch(() => new CustomError(500, 'На сервере произошла ошибка'));
};

export const createCard = async (req: RequestWithUser, res: Response) => {
  const { name, link } = req.body;
  const userId = req.user?._id;
  return card.create({
    name,
    link,
    owner: userId,
  })
    .then((out) => res.send(out))
    .catch(() => new CustomError(500, 'На сервере произошла ошибка'));
};
