import { celebrate, Joi, Segments } from 'celebrate';

export interface IOrder {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export const createOrderValidation = celebrate({
  [Segments.BODY]: Joi.object({
    items: Joi.array()
      .items(Joi.string().hex().length(24).required())
      .min(1)
      .required()
      .messages({
        'array.min': 'Необходимо указать хотя бы один товар',
        'any.required': 'Необходимо указать хотя бы один товар',
      }),
    total: Joi.number()
      .positive()
      .required()
      .messages({
        'number.positive': 'Сумма должна быть положительным числом',
        'any.required': 'Сумма заказа обязательна',
        'number.base': 'Сумма должна быть числом',
      }),
    payment: Joi.string()
      .valid('card', 'online')
      .required()
      .messages({
        'any.required': 'Выбор способа оплаты обязателен',
        'any.only': 'Недопустимый способ оплаты',
      }),
    email: Joi.string()
      .pattern(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/)
      .required()
      .messages({
        'string.email': 'Неверный формат email',
        'any.required': 'Email обязателен',
      }),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .min(10)
      .max(15)
      .required()
      .messages({
        'any.required': 'Телефон обязателен',
      }),
    address: Joi.string()
      .required()
      .messages({
        'any.required': 'Адрес обязателен',
      }),
  }),
}, {
  abortEarly: false,
});
