import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cardsRoutes from './routes/cards';
import usersRoutes from './routes/users';

require('dotenv').config();

const connectOptions = {
  dbName: process.env.DB_NAME,
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

// Проверка подключения к БД
mongoose.connect(`mongodb://${process.env.DB_CONN}`, connectOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, '[mongoose] Ошибка подключения: '));
db.once('open', () => {
  console.log('[mongoose] Подлючение установлено');
});

const app = express();

// Заглушка для аутантификации
app.use((req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  req.user = {
    _id: '654bfad3a146ecb38cc02ec4',
  };
  next();
});

app.use(express.json());
app.use('/', cardsRoutes);
app.use('/', usersRoutes);

// Default path
app.use((req: Request, res: Response) => {
  res.status(500);
  res.send('На сервере произошла ошибка');
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
