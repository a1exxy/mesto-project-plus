import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/customError';
import { RequestWithUser } from '../utils/types';

const secret = process.env.SECRET!;

export default (req: RequestWithUser, _res: Response, next: NextFunction) => {
  const authorization = req.headers.cookie
    ? req.headers.cookie.split(';').find((i) => i.startsWith('authorization='))
    : null;
  if (!authorization) {
    return next(new CustomError(401, 'Необходима авторизация'));
  }
  const token = authorization!.split('=')[1];
  let payload:any;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    return next(new CustomError(401, 'Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
