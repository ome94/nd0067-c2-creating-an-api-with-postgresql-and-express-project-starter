import { Request, Response } from "express";
import { store } from "./products.routes";

export const validateProduct = (req: Request, res: Response, next: () => void) => {
  const { name, price } = req.body;
  if (!name) {
    res.status(400)
    .json('Product name is required but not supplied!');
  } else if (!price || isNaN(parseFloat(price))) {
    
    if (!price) {
      res.status(400)
      .json('Product price is required but not supplied!');
    }
    else{
      res.status(400)
      .json('Invalid product price supplied!');
    }
    
  } else next();
}

export const checkExisting = async (req: Request, res: Response, next: ()=>void) => {
  const { name } = req.body;
  const existingProducts = await store.index();
  const productExists = existingProducts.some(product => product.name === name);
  
  if (productExists)
    res.status(400)
      .json('Error! Product already exists');
  
  else next();
}
