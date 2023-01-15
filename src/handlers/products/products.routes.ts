import { Request, Response, Router } from "express";
import { ProductStore } from "../../models/product";
import { authorize } from "../users/utils/authorize";
import { validateProduct } from "./validate";

export const store = new ProductStore();

const products = Router();

const index = async (_req: Request, res: Response) => {
  const allProducts = await store.index();
  res.json(allProducts);
}

const show = async (req: Request, res: Response) => {
  const product = await store.show(<unknown>req.params.id as number);
  
  res.status(200).json(product);
}

const create = async (req: Request, res: Response) => {
  const product = await store.create({...req.body});

  res.status(201).json(product);
}

products.route('/')
  .get(index)
  .post(authorize("admin"), validateProduct, create);

products.get('/:id', show);
export default products