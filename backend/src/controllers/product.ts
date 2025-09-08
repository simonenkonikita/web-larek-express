import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import {
  BadRequestError,
  ConflictError,
  statusCode,
} from '../errors/index';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});

    res.status(statusCode.OK).json({
      success: true,
      data: {
        items: products,
        total: products.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;

    const existingProduct = await Product.findOne({ title: body.title });

    if (existingProduct) {
      throw new ConflictError('Товар с таким названием уже существует');
    }

    const product = await Product.create(body);

    return res.status(statusCode.CREATED).json({
      success: true,
      data: product,
      message: 'Продукт успешно создан',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      if (error.message.includes('title')) {
        return next(new ConflictError('Товар с таким названием уже существует'));
      }
      return next(error);
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Ошибка валидации данных при создании товара'));
    }
    return next(error);
  }
};
