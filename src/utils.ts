import { Joi } from 'celebrate';

export const updateOptions = { new: true, runValidators: true, upsert: true };

export const userIdFormat = Joi.object().keys({
  userId: Joi
    .string()
    .alphanum()
    .required()
    .min(24)
    .max(24),
});

export const userPasswdFormat = Joi.string()
  .regex(/[a-z]/) // Хотя бы одна строчная буква
  .regex(/[A-Z]/) // Хотя бы одна заглавная буква
  .regex(/[0-9]/) // Хотя бы одна цифра
  .regex(/[!@#$%^&*]/) // Хотя бы один спец. символ
  .min(8)
  .max(64)
  .required();

export const emailFormat = Joi.string().email().required();
export const nameFormat = Joi.string().min(2).max(30);
export const aboutFormat = Joi.string().min(2).max(200);
export const linkFormat = Joi.string().uri().max(2048);

