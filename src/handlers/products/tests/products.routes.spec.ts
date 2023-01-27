import { Product } from "../../../models/product";
import { createAllUsers, deleteAllUsers, login, request, testUsers } from "../../users/tests/util";
import { createAllProducts, deleteAllProducts, testProducts } from "./util";


let token: string;
let user = testUsers[0];
let admin = testUsers[1];

let product: Product;

describe('Test products routes', () => {
  beforeAll(async () => {
    await createAllUsers();
    await createAllProducts();
  });

  afterAll(async () => {
    await deleteAllUsers();
    await deleteAllProducts();
  });

  describe('Test product index (GET /products)', () => {
    it('Expects GET /products to respond with all products', async () => {
      const response = await request.get('/products');
      expect(response.status).toBe(200);
    });
  })
  
  describe('Test create route (POST /products) ', () => {
    describe('Test unauthenticated request', () => {
      it('Expects 401 response for unauthenticated request', async () => {
        const response = await request.post('/products')
              .send(product);

        expect(response.status).toBe(401)
      })
    })

    describe('Test unauthorized requests', () => {
      beforeAll(async () => token = await login(user));

      it('Expects 403 response for unauthorized request', async () => {
        const response = await request.post('/products')
                                      .set({authorization: token})
                                      .send(product);
        expect(response.status).toBe(403);
      })
    })

    describe('Test authorized requests', () => {
      beforeAll(async () => token = await login(admin));

      it('Expects 400 response for wrong product formats', async () => {
        const response = await request.post('/products')
                                      .set({authorization: token})
                                      .send(product);
        expect(response.status).toBe(400);
      })

      it('Expects 201 response for newly created product row', async () => {
        const response = await request.post('/products')
                                      .set({authorization: token})
                                      .send(testProducts[0]);
        expect(response.status).toBe(201);
      })
    })

  });

  describe('Test show products (GET /products/:id)', () => {
    beforeEach(async () => product = (await request.get('/products')).body[0]);

    it(`Expects GET /products/:id to respond with product of specified id`,
        async () => {
      const response = await request.get(`/products/${product.id}`);
      expect(response.status).toBe(200);
    })
  })
})