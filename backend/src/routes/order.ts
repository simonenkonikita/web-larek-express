import express from 'express';
import { createOrderValidation } from '../middlewares/validations';
import createOrder from '../controllers/order';

const router = express.Router();

router.post('/', createOrderValidation, createOrder);

export default router;
