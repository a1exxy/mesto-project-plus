import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import { connectOptions, dbUri } from './config';
import router from './routes';
import errorHandler from './utils/errorHandler';

// Проверка подключения к БД
mongoose.connect(dbUri, connectOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, '[mongoose] Ошибка подключения: '));
db.once('open', () => {
  console.info('[mongoose] Подлючение установлено');
});

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.info(`App listening on port ${process.env.PORT}`);
});
