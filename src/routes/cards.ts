import express from 'express';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const cardRouter = express.Router();

export default cardRouter
  // GET /cards — возвращает все карточки
  .get('/cards', getCards)

  // POST /cards — создаёт карточку
  // В теле POST-запроса на создание карточки передайте JSON-объект с двумя полями: name и link.
  .post('/cards', createCard)

  // DELETE /cards/:cardId — удаляет карточку по идентификатору
  .delete('/cards/:cardId', deleteCard)

  // PUT /cards/:cardId/likes — поставить лайк карточке
  .put('/cards/:cardId/likes', likeCard)

  // DELETE /cards/:cardId/likes — убрать лайк с карточки
  .delete('/cards/:cardId/likes', dislikeCard);
