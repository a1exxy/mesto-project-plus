import { Joi } from 'celebrate';

export const updateOptions = { new: true, runValidators: true, upsert: true };

const idFormat = Joi
  .string()
  .alphanum()
  .required()
  .min(24)
  .max(24);

export const userIdFormat = Joi.object().keys({ userId: idFormat });
export const cardIdFormat = Joi.object().keys({ cardId: idFormat });

export const userPasswdFormat = Joi.string()
  .regex(/[a-z]/) // Хотя бы одна строчная буква
  .regex(/[A-Z]/) // Хотя бы одна заглавная буква
  .regex(/[0-9]/) // Хотя бы одна цифра
  .regex(/[!@#$%^&*]/) // Хотя бы один спец. символ
  .min(8) // Не меньше 8 символов
  .max(64) // Не больше 64 символов
  .required();

export const emailFormat = Joi.string().email().required();
export const nameFormat = Joi.string().min(2).max(30);
export const aboutFormat = Joi.string().min(2).max(200);
export const linkFormat = Joi.string().uri().max(2048);
