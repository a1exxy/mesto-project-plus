import { Request, Response } from 'express';
import card from '../models/card';

export const getCards = (req: Request, res: Response) => card.find({})
  .then((out) => res.send(out))
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  return card.findByIdAndRemove(cardId)
    .then((out) => {
      if (out) {
        res.send(out);
      } else {
        res.status(404).send({ error: `Карточка с _id = ${cardId} не найдена` });
      }
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

export const likeCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  return card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        likes: req.user._id,
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
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

export const dislikeCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  return card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        likes: req.user._id,
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
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  return card.create({
    name,
    link,
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    owner: req.user._id,
  })
    .then((out) => res.send(out))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};
