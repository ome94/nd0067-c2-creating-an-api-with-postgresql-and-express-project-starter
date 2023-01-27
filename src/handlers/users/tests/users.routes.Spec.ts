import supertest from 'supertest';

import app from '../../../server';
import { UserInfo } from '../../../models/user';
import { createAllUsers, deleteAllUsers, login, request, testUsers } from "./util";


let token: string;
let user: UserInfo;
let user2: UserInfo;
let invalidUser: UserInfo;
let admin: UserInfo;

describe('Test users authentication routes', () => {
  beforeAll(async () => {
    user = testUsers[0];
    user2 = testUsers[2];
    admin = testUsers[1];
    invalidUser = {username: 'invalid', password: 'password'};
  });

  describe('Test /users route', () => {
    describe('Test POST /users', () => {
      beforeEach(async () => await deleteAllUsers());
      afterEach(async () => await deleteAllUsers());

      it('Expects POST /users to create a new user', async () => {
        const response = await request.post('/users').send(user);
        expect(response.status).toBe(201);
      });

      it('Expects POST /users to receive the same User created', async () => {
        const response = await request.post('/users').send(user);
        expect(response.body.username).toEqual(user.username);
      });
    });

    describe('Test GET /users', () => {
      beforeAll(async () => await createAllUsers());

      afterAll(async () => await deleteAllUsers());

      describe('Test un-aunthenticated access', () => {
        it('Expects GET /users to be 401 for non-authenticated users', async () => {
          const response = await request.get('/users');
          expect(response.status).toBe(401);
        });
      });
  
      describe('Test unauthorised user access', () => {
        beforeAll(async () => token = await login(user));
        
        it('Expects GET /users to be 403 for non-authorized users', async () => {
          const response = await request.get('/users')
                                        .set({authorization: token});
                                        
        expect(response.status).toBe(403);
        });
      })
      
      describe('Test authorised user access', () => {
        beforeAll(async () => token = await login(admin));
        
        it('Expects GET /users to be 200 for admin users', async () => {
          const response = await request.get('/users')
                                        .set({authorization: token});

          expect(response.status).toBe(200);
        });
      });
    });

  });


  describe('Test user login /users/login', () => {
    beforeAll(async () => await createAllUsers());

    afterAll(async () => await deleteAllUsers());

    it('Expects POST /users/login to be ok', async () => {
      const response = await request.post('/users/login').send(user);
      expect(response.status).toBe(200);
    });

    it('Expects POST /users/login to fail given no credentials', async () => {
      const response = await request.post('/users/login');
      expect(response.status).toBe(404);
    });

    it('Expects POST /users/login to fail given wrong credentials', async () => {
      const response = await request.post('/users/login').send(invalidUser);
      expect(response.status).toBe(404);
    });

  });


  describe('Test show user /users/user', () => {
    beforeAll(async () => {
      await createAllUsers();
      token = await login(user);
    });

    afterAll(async () => await deleteAllUsers())

    describe('Test unauthorized user', () => {
      it('Expects GET /users/user to fail for users not authenticated', async () => {
        const response = await request.get(`/users/user/${user.username}`);
        expect(response.status).toBe(401);
      });

      it(`Expects GET /users/user/${testUsers[2].username} to fail for ${testUsers[0].username}`, async () => {
        const response = await request.get(`/users/user/${user2.username}`)
                                      .set({authorization: token});

        expect(response.status).toBe(403);
      });
    });

    describe('Test for authorized user', () => {
      it('Expects GET /users/user to be 200 for authorized users', async () => {
        const response = await request.get(`/users/user/${user.username}`)
                                      .set({authorization: token});
        
        expect(response.status).toBe(200);
      });
    });

    describe('Test for admin user', () => {
      beforeAll(async () => token = await login(admin));

      it('Expects GET /users/user to be 200 for admin users', async () => {
        const response = await request.get(`/users/user/${user.username}`)
                                      .set({authorization: token});
        
        expect(response.status).toBe(200);
      });

      it(`Expects GET /users/user/${testUsers[0].username} to succeed for ${testUsers[1].username}
          i.e. admin can view other users`,
          async () => {
        const response = await request.get(`/users/user/${user.username}`)
                                      .set({authorization: token});

        expect(response.status).toBe(200);
      });

    });
  });
});
