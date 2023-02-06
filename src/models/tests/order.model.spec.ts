import { createAllUsers, deleteAllUsers } from "../../handlers/users/tests/util";
import { Order, OrderCard } from "../order";
import { User } from "../user";


describe('Test Order Model', () => {
  const orders = new Order();
  let userId: number;
  let orderId: number;

  beforeAll(async () => {
    const users = new User();
    await createAllUsers();
    userId = (await users.index())[0].id as number;
  });

  afterAll(async() => await orders.delete().then(deleteAllUsers));

  describe('Test Order.index()', () => {
    it('Expects a defined index function', () => {
      expect(orders.index).toBeDefined()
    });

    it('Expects an initial empty table', async () => {
      const results = await orders.index();
      expect(results).toEqual([]);
    });
  });

  describe('Test Order.create()', () => {
    let result: Promise<OrderCard>;

    it('Expects a defined create function', () => {
      expect(orders.create).toBeDefined()
    })

    it('Expects new order row to be returned', async () => {
      result = orders.create(userId);
      expect(result).toBeDefined();
    });

    it(`Expects new order row to be have user id(${userId})`, async () => {
      expect((await result).user_id).toBe(userId);
    });

    it('Expects new order status to be active', async () => {
      expect((await result).status).toBe('active');
    });
  })

  describe('Test Order.show()', () => {
    beforeAll(
      async () => 
        orderId = (await orders.showActive(userId)).id as number
    );

    it('Expects a defined show function', () => {
      expect(orders.show).toBeDefined()
    })

    it('Expects order to be returned from table', async () => {
      const result = await orders.show(orderId);
      expect(result).toBeDefined();
    });

    it(`Expects returned order row to have order id ${orderId}`, async () => {
      const result = await orders.show(orderId);
      expect(result.id).toBe(orderId);
    });
  });

  describe('Test Order.showActive()', () => {
    it('Expects a row to be returned from orders table', async () => {
      const result = await orders.showActive(userId);
      expect(result).toBeDefined();
    });

    it('Expects a row to be returned from orders table', async () => {
      const result = await orders.showActive(userId);
      expect(result.user_id).toBe(userId);
    });

    it('Expects returned row to be an active order', async () => {
      const result = await orders.showActive(userId);
      expect(result.status).toBe('active');
    });
  });

  describe('Test Order.checkout()', () => {
    let active: OrderCard;
    let complete: OrderCard;
    
    beforeAll(async () => {
      active = await orders.showActive(userId);
      complete = await orders.checkout(active.user_id);
    });

    it('Expects active order to be completed', () => {
      expect(complete.status).toBe('complete');
    })

    it('Expects complete order to be the same as the previous active order', () => {
      expect(complete.id).toBe(active.id);
    });
  });

  describe('Test Order.delete()', () => {
    let table: OrderCard[];
    beforeAll(async () => table = await orders.index());

    it('Expects deletion of rows with specific order id', async () => {
      await orders.delete(orderId.toString());
      const results = await orders.index();
      expect(results).toHaveSize(table.length - 1);
    });

    it('Expects all rows to be deleted given no order id', async () => {
      await orders.delete();
      const results = await orders.index();
      expect(results).toEqual([]);
    });
  });
})