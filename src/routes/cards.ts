import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import {
  cardIdFormat,
  linkFormat,
  nameFormat,
} from '../utils/validation';

const cardRouter = express.Router();

export default cardRouter

  // GET /cards — возвращает все карточки
  .get('/', getCards)

  // POST /cards — создаёт карточку
  .post('/', celebrate({
    body: Joi.object().keys({
      name: nameFormat.required(),
      link: linkFormat.required(),
    }),
  }), createCard)

  // DELETE /cards/:cardId — удаляет карточку по идентификатору
  .delete('/:cardId', celebrate({ params: cardIdFormat }), deleteCard)

  // PUT /cards/:cardId/likes — поставить лайк карточке
  .put('/:cardId/likes', celebrate({ params: cardIdFormat }), likeCard)

  // DELETE /cards/:cardId/likes — убрать лайк с карточки
  .delete('/:cardId/likes', celebrate({ params: cardIdFormat }), dislikeCard);
