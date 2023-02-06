import supertest from "supertest";

import app from "../../../server";

import { UserInfo } from "../../../models/user";
import { Product, ProductStore } from "../../../models/product";

import { createAllUsers, deleteAllUsers, login, testUsers } from "../../users/tests/util";
import { createAllProducts, deleteAllProducts } from "../../products/tests/util";
import { deleteAllOrders } from "./util";

const request = supertest(app);
const products = new ProductStore();

let product: Product;
let user: UserInfo;
let admin: UserInfo;
let token: string;

describe('Test Orders route', () => {
  beforeAll(async () => {
    await createAllUsers();
    await createAllProducts();
    
    user = testUsers[0];
    admin = testUsers.find(usr => usr.status === 'admin') as UserInfo;
  });

  afterAll(async () => {
    await deleteAllOrders().then(deleteAllUsers);
    await deleteAllProducts();
  });

  describe('Test GET /orders', () => {
    describe('Test unaunthenticated request', () => {
      it('Expects 401 for unauthenticated request',async () => {
        const response = await request.get('/orders');
        expect(response.status).toBe(401);
      });
    });

    describe('Test unauthorized request', () => {
      beforeAll(async () => token = await login(user));

      it('Expects 403 response for unauthorized request', async () => {
        const response = await request.get('/orders')
                                      .set({authorization: token})
        ;
        expect(response.status).toBe(403);
      });
    });

    describe('Test authorized request', () => {
      beforeAll(async () => token = await login(admin));

      it('Expects 200 response for authorized request', async () => {
        const response = await request.get('/orders')
                                      .set({authorization: token})
        ;
        expect(response.status).toBe(200);
      });
    })
  });
  
  describe('Test POST /orders', () => {
    beforeAll(async () => product = (await products.index())[0]);

    describe('Test unauthenticated request', () => {
      it('Expects 401 response for unauthenticated request', async () => {
        const response = await request.post('/orders')
                                      .send({productId: product.id, quantity: 5})
        ;
        expect(response.status).toBe(401);
      });
    })

    describe('Test authenticated request', () => {
      beforeAll(async () => token = await login(user));

      it('Expects 201 response for authenticated request', async () => {
        const response = await request.post('/orders')
                                      .set({authorization: token})
                                      .send({productId: product.id, quantity: 5})
        ;
        expect(response.status).toBe(201);
      });

      it('Expects 400 response for poor format request', async () => {
        const response = await request.post('/orders')
                                      .set({authorization: token})
                                      .send({})
        ;
        expect(response.status).toBe(404);
      });

      it('Expects 404 response for invalid product order request', async () => {
        const response = await request.post('/orders')
                                      .set({authorization: token})
                                      .send({productId: 'invalid', quantity: 5})
        ;
        expect(response.status).toBe(404);
      });
    })
  });

  describe('Test GET /orders/cart', () => {
    describe('Test unauthenticated request', () => {
      it('Expects 401 response for unauthenticated request', async () => {
        const response = await request.get('/orders/cart');
        expect(response.status).toBe(401);
      });
    });

    describe('Test authenticated request', () => {
      beforeAll(async () => token = await login(user));

      it('Expects 200 response for authenticated request', async () => {
        const response = await request.get('/orders/cart')
                                      .set({authorization: token});
        ;
        expect(response.status).toBe(200)
      });
    });
  });

  describe('Test GET /orders/checkout', () => {
    describe('Test unauthenticated request', () => {
      it('Expects 401 response for unauthenticated request', async () => {
        const response = await request.get('/orders/checkout');
        expect(response.status).toBe(401)
      });
    });

    describe('Test authenticated request', () => {
      beforeAll(async () => token = await login(user));
      
      it('Expects 200 response for authenticated request', async () => {
        const response = await request.get('/orders/checkout')
                                      .set({authorization: token});
        ;
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Test GET /orders/:id', () => {
    describe('Test unauthenticated request', () => {
      it('Expects 401 response for unauthenticated request', async () => {
        const response = await request.get('/orders/1');
        expect(response.status).toBe(401);
      });
    });

    describe('Test authenticated request', () => {
      beforeAll(async () => token = await login(user));
      
      it('Expects 200 response for authenticated request', async () => {
        const response = await request.get('/orders/1')
                                      .set({authorization: token});
        ;
        expect(response.status).toBe(200)
      });
    });
  });
});