import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/customError';

const secret = process.env.SECRET!;

// eslint-disable-next-line consistent-return
export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.cookie
    ? req.headers.cookie.split(';').find((i) => i.startsWith('authorization='))
    : null;
  if (!authorization) {
    // res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    next(new CustomError(401, 'Необходима авторизация'));
  }
  const token = authorization!.split('=')[1];
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    // res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    next(new CustomError(401, 'Необходима авторизация'));
  }
  // @ts-ignore
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
