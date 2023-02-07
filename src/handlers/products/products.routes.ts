import { Request, Response, Router } from "express";

import { ProductStore } from "../../models/product";
import { authorize } from "../users/utils/authorize";
import { validateProduct } from "./validate";

export const store = new ProductStore();

const products = Router();

const index = async (_req: Request, res: Response) => {
  try{
    const allProducts = await store.index();
    res.json(allProducts);
  } catch(err){
      res.status(500).json(err);
  }
}

const show = async (req: Request, res: Response) => {
  try{
    const product = await store.show(<unknown>req.params.id as number);
    res.status(200).json(product);
  } catch(err){
      res.status(500).json(err);
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const product = await store.create({...req.body});
    res.status(201).json(product);
  } catch (err) {
      res.status(500).json(err);
  }
}

products.route('/')
  .get(index)
  .post(authorize("admin"), validateProduct, create);

products.get('/:id', show);

export default products