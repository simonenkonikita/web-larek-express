import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import { IOrder } from '../middlewares/validations';
import statusCode from '../errors/statusCode';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { total, items }: IOrder = req.body;
  const orderId = randomUUID();

  try {
    const products = await Product.find({
      _id: { $in: items },
      price: { $ne: null },
    });

    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);

    if (products.length !== items.length) {
      const foundIds = products.map((product) => product._id.toString());
      const missingItems = items.filter((id) => !foundIds.includes(id));

      return next(new BadRequestError(`Товары не найдены: ${missingItems.join(', ')}`));
    }

    if (calculatedTotal !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      data: {
        id: orderId,
        total: calculatedTotal,
        message: 'Заказ успешно создан',
      },
    });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Ошибка создания заказа'));
    }
    return next(error);
  }
};

export default createOrder;
