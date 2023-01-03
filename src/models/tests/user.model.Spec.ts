import { User, UserInfo } from "../user";

let user: UserInfo;
const testUsers: UserInfo[] = [
  {username: "testUser1", password: "password"},
  {username: "testUser2", password: "password2", status: "admin"}
];

describe('Test User model', () => {
  const users = new User();

  beforeAll(async () => {
    await users.delete()
    user = testUsers[0];
  });

  afterAll(async () => await users.delete());
  
  describe('Test empty table', () => {
    describe('Test User.index()', () => {
      it('Expects a defined index function ', () => {
        expect(users.index).toBeDefined();
      });
  
      it('Expects an empty users table', async () => {
        const results = await users.index();
        expect(results).toEqual([]);
      });
    });

    describe('Test User.show()', () => {
      it('Expects a defined show function ', () => {
        expect(users.show).toBeDefined();
      });
  
      it('Expects an empty users table', async () => {
        const results = await users.show(user.username);
        expect(results).not.toBeDefined();
      });
    });
  
    describe('Test User.create()', () => {
      it('Expects a defined index function ', () => {
        expect(users.create).toBeDefined();
      });
  
      it('Expects a row created in users table', async () => {
        const results = await users.create(user);
        expect(results.username).toEqual(testUsers[0].username);
      });
    });
  });
  
  describe('Test populated table', () => {
    beforeAll(async () => {
      // start with an empty table to ensure unique usernames
      await users.delete();
      
      for(let user of testUsers){
        await users.create(user);
      }

      user = testUsers[0];
    });

    afterAll(async () => await users.delete());

    describe('Test User.index() and User.show() on populated table', () => {
      it(`Expects a table with ${testUsers.length} rows`, async () => {
        const results = await users.index();
        expect(results).toHaveSize(testUsers.length);
      });
  
      it('Expects an empty users table', async () => {
        const result = await users.show(user.username);
        expect(result.username).toBe(user.username);
      });
    });

    describe('Test User.authenticate()', () => {
      it('Expects successful authentication for valid user', async () => {
        const validUser = await users.authenticate(user.username, user.password);
        expect(validUser!.username).toEqual(user.username);
      });
  
      it('Expects failed authentication of invalid password', async () => {
        const invalidUser = await users.authenticate(user.username, 'wrong password');
        expect(invalidUser).toBe(null);
      });
  
      it('Expects failed authentication of invalid user', async () => {
        const invalidUser = await users.authenticate('invalid username', 'wrong password');
        expect(invalidUser).toBe(null);
      });
    });

    describe('Test User.delete()', () => {
      it('Expects User.delete() to be defined', () => {
        expect(users.delete).toBeDefined();
      });

      it('Expexts a single row deleted from the table', async () => {
        await users.delete(user.username)
        const table =  await users.index();
        expect(table).toHaveSize(testUsers.length-1);
      });

      it('Expects all rows completely deleted from the table', async () => {
        await users.delete();
        const table = await users.index();
        expect(table).toEqual([]);
      });
    })
  });
});
