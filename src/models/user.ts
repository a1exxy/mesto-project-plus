import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import CustomError from '../customError';

const defaultName = 'Жак-Ив Кусто';
const defaultAbout = 'Исследователь';
const defaultAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';
const saltSize = Number(process.env.SALT_SIZE);

interface IUser {
  name?: string
  about?: string
  avatar?: string
  email: string
  password: string
}

interface UserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  createIfNotExist: (options: IUser) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultName,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: defaultAbout,
  },
  avatar: {
    type: String,
    default: defaultAvatar,
    validate: [validator.isURL, 'Не корректная ссылка'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Не корректный email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { toObject: { useProjection: true }, toJSON: { useProjection: true } });

userSchema.static('createIfNotExist', async function createIfNotExist(options: IUser) {
  return this.findOne({ email: options.email })
    .then((user) => {
      if (!user) {
        return bcrypt.hash(options.password, saltSize)
          .then((hash) => this.create(
            {
              name: options.name,
              about: options.about,
              avatar: options.avatar,
              email: options.email,
              password: hash,
            },
          )
            // eslint-disable-next-line no-underscore-dangle
            .then((out) => Promise.resolve(out)))
          .catch(() => Promise.reject(new CustomError(500, 'На сервере произошла ошибка')));
      }
      return Promise.reject(new CustomError(409, 'Почта уже существует'));
    });
});

export default mongoose.model<IUser>('user', userSchema);
