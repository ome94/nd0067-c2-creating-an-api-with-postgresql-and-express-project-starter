import { Product, ProductStore } from "../product"


let product: Product;
const testProducts: Product[] = [
  {name: 'Hammer', price: 49.99},
  {name: 'Screwdriver', price: 34.44}
]

describe('Test Product model', () => {
  const products = new ProductStore();

  describe('Test empty table', () => {
    describe('Test ProductStore.index()', () => {
      it('Expects a defined index function', () => {
        expect(products.index).toBeDefined();
      });

      it('Expects an initial empty products table', async () => {
        const results = await products.index();
        expect(results).toEqual([]);
      });
    })

    describe('Test ProductStore.show()', () => {
      it('Expects ProductStore.show() to be defined', () => {
        expect(products.show).toBeDefined();
      });

      it('Expects an undefined product', async () => {
        const result = await products.show(<number>product?.id);
        expect(result).toBeUndefined();
      });
    })

    describe('Test ProductStore.delete()', () => {
      it('Expects ProductStore.delete() to be defined', async () => {
        expect(products.delete).toBeDefined();
      });

      it('Expects an empty array returned from deleting empty table', async () => {
        const results = await products.delete();
        expect(results).toEqual([]);
      })
    })
  })

  describe('Test populating products table', () => {
    beforeAll(async () => {
      await products.delete()
      product = testProducts[0];
    });

    afterAll(async () => await products.delete());

    describe('Test ProductStore.create()', () => {
      it('Expects new produt row to be returned',async () => {
        const row = await products.create(product);
        expect(row).toBeDefined();
      })

      it('Expects new product to be added to the table',async () => {
        const row = await products.create(product);
        const result = await products.show(<number>row.id);
        expect(row).toEqual(result);
      });
    })
  })

  describe('Test populated table', () => {
    beforeAll(async () => {
      await products.delete();
      for (product of testProducts)
        product = await products.create(product);
    })

    afterAll(async () => await products.delete());

    describe('Test ProductStore.index()', () => {
      it('Expects a populated products table', async () => {
        const results = await products.index();
        expect(results).toBeTruthy();
      });

      it('Expects number of rows returned to equal number of added products', async () => {
        const results = await products.index();
        expect(results.length).toBe(testProducts.length);
      })
    })

    describe('Test ProductStore.show()', () => {
      it('Expects a product from products table ', async () => {
        const result = await products.show(<number>product?.id);
        expect(result).toBeDefined();
      });
    })

    describe('Test ProductStore.delete()', () => {
      beforeEach(async () => {
        await products.delete()
        for (let product of testProducts)
          await products.create(product)
      });

      afterEach(async () => await products.delete());

      it('Expects rows deleted from populated products table', async () => {
        const results = await products.delete();
        expect(results).toBeTruthy();
      });

      it('Expects number of rows deleted to equal number of added products', async () => {
        const results = await products.delete();
        expect(results.length).toBe(testProducts.length);
      })
    })
  })
})