import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import { linkFormat, nameFormat, userIdFormat } from '../utils';

const cardRouter = express.Router();

export default cardRouter
  // GET /cards — возвращает все карточки
  .get('/cards', getCards)

  // POST /cards — создаёт карточку
  .post('/cards', celebrate({
    body: Joi.object().keys({
      name: nameFormat.required(),
      link: linkFormat.required(),
    }),
  }), createCard)

  // DELETE /cards/:cardId — удаляет карточку по идентификатору
  .delete('/cards/:cardId', celebrate({ params: userIdFormat }), deleteCard)

  // PUT /cards/:cardId/likes — поставить лайк карточке
  .put('/cards/:cardId/likes', celebrate({ params: userIdFormat }), likeCard)

  // DELETE /cards/:cardId/likes — убрать лайк с карточки
  .delete('/cards/:cardId/likes', celebrate({ params: userIdFormat }), dislikeCard);
