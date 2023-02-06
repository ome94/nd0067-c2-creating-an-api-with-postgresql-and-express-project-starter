import { Request, Response, Router } from "express";

import { authorize } from "../users/utils/authorize";
import { verify } from "../users/utils/authorize";
import { OrderService } from "../../services/orders";

const orders = Router();
const carts = new OrderService()

const index = async (_req: Request, res: Response) => {
  const allOrders = await carts.index();

  res.status(200).json(allOrders);
}

const show = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  const order = await carts.show(orderId);

  res.status(200).json(order);
}

const addProduct = async (req: Request, res: Response) => {
  const userId = <number>verify(req);
  const { productId, quantity } = req.body;
  try {
    const order = await carts.addToCart(productId, userId, quantity);
    res.status(201).json(order);
  } catch (err) {
      res.status(404).json('Order/User/Product not found')
      console.error(new Error('Order/User/Product not found'));
  }
}

const cart = async (req: Request, res: Response) => {
  const userId = <number>verify(req);

  try {
    const order = await carts.currentOrder(userId);
    res.status(200).json(order)
  } catch (err) {
    res.status(404).json('No Orders by User yet!')
    console.error(new Error('No Orders by User yet!'));
  }
}

const checkout = async (req: Request, res: Response) => {
  const userId = <number>verify(req);
  try {
    const order = await carts.completeOrder(userId);
    res.status(200).json(order);
  } catch (err) {
      res.status(404).json('User not found');
      console.error(new Error('User not found'))
  }
}

orders.route('/')
    .get(authorize('admin'), index)
    .post(authorize('user'), addProduct);

orders.get('/cart', authorize('user'), cart)
orders.get('/checkout', authorize('user'), checkout);
orders.get('/:id', authorize('user'), show);

export default orders;