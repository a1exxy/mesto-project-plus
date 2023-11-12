import mongoose from 'mongoose';
import validator from 'validator';

const defaultName = 'Жак-Ив Кусто';
const defaultAbout = 'Исследователь';
const defaultAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

interface IUser {
  name: string
  about: string
  avatar: string
  email: string
  password: string
}

const userSchema = new mongoose.Schema<IUser>({
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
});

export default mongoose.model<IUser>('user', userSchema);
