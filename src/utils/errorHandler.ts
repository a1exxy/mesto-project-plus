import { Request, Response } from 'express';

const errorHandler = (err: any, _req: Request, res: Response) => {
  res.status(err.statusCode).send({ message: err.message });
};

export default errorHandler;
