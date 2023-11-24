import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import {
  defaultAbout,
  defaultAvatar,
  defaultName,
} from '../config';
import CustomError from '../utils/customError';

interface IUser {
  name?: string
  about?: string
  avatar?: string
  email: string
  password: string
}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  checkCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
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

userSchema.static('checkCredentials', async function checkCredentials(email: string, password: string): Promise<IUser> {
  return this.findOne({ email }).select('+password')
    .then(async (user) => {
      if (!user) {
        throw new CustomError(401, 'Неправильные почта или пароль');
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new CustomError(401, 'Неправильные почта или пароль');
      }
      return user;
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
