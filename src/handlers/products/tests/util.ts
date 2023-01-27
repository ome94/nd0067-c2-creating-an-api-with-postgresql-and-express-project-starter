import { Product, ProductStore } from "../../../models/product";

const products = new ProductStore()
const testProducts: Product[] = [
  {name: 'Hammer', price: 49.99},
  {name: 'Screwdriver', price: 34.44}
]


const createAllProducts = async () => {
  for (let product of testProducts)
    await products.create(product);
}

const deleteAllProducts = async () => await products.delete();

export {createAllProducts, deleteAllProducts, testProducts};