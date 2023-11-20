import 'dotenv/config';

export const connectOptions = {
  dbName: process.env.DB_NAME,
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};
export const dbUri = `mongodb://${process.env.DB_CONN}`;
export const expires = Number(process.env.SESSION_EXPIRES);
export const secret = process.env.SECRET!;
export const defaultName = 'Жак-Ив Кусто';
export const defaultAbout = 'Исследователь';
export const defaultAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';
export const saltSize = Number(process.env.SALT_SIZE);
