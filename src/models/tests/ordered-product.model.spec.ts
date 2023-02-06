import { createAllUsers, deleteAllUsers } from "../../handlers/users/tests/util";
import { Order, OrderCard } from "../order";
import { OrderBooking, OrderItem } from "../ordered-product";
import { Product, ProductStore } from "../product";
import { User, UserInfo } from "../user";

const orders = new Order();
const products = new ProductStore();
const orderLog = new OrderBooking();
let user: UserInfo;
let order: OrderCard;
let product: Product;


const testProducts: Product[] = [
  {name: 'Hammer', price: 49.99},
  {name: 'Screwdriver', price: 34.44}
]  

describe('Test OrderBooking model (ordered_products table)', () => {
  beforeAll(async () => {
    const users = new User();
    await createAllUsers();

    user = (await users.index())[0];
    order = await orders.create(<number>user.id);

    for (let prd of testProducts)
      product = await products.create(prd);

  });

  afterAll(async () => await orderLog.delete()
                    .then(() => products.delete())
                    .then(() => orders.delete())
                    .then(deleteAllUsers))
  ;

  describe('Test OrderBooking.index()', () => {

    it('Expects a defined index function', async () => {
      expect(orderLog.index).toBeDefined();
    });

    it('Expects an initial empty table', async () => {
      const results = await orderLog.index();
      expect(results).toEqual([]);
    });
  });

  describe('Test OrderBooking.create()', () => {
    it('Expects a defined create function', async () => {
      expect(orderLog.create).toBeDefined();
    });

    it('Expects created row to be returned', async () => {
      const result = await orderLog.create(<number>order.id, <number>product.id);
      expect(parseInt(<unknown>result.order_id as string)).toBe(<number>order.id);
    });
  });

  describe('Test OrderBooking.show()', () => {
    let results: OrderItem[];
  
    beforeAll(async () => {
      results = await orderLog.show(<number>order.id);
    })

    it('Expects a defined show function', () => {
      expect(orderLog.show).toBeDefined();
    });
    
    it('Expects returned rows from .show()', async () => {
      expect(results).toBeDefined();
    });
    
    it('Expects returned rows to have the specified order_id',async () => {
      expect(results.every(ord => parseInt(ord.order_id.toString()) === order.id)).toBeTrue();
    });
  });

  describe('Test OrderBooking.addToCart()', () => {
    let currentItem: OrderItem;
    const increment = 2;

    beforeAll(async () => {
      currentItem = (await orderLog.show(<number>order.id)).find(
        item => item.product_id === product.id
      ) as OrderItem;
    });

    it('Expects quantity to increase if product is already in cart', async () => {
      const result = await orderLog.addToOrder(<number>order.id, <number>product.id, increment)
      expect(result.quantity).toBe(currentItem.quantity+increment);
    });
  })
})