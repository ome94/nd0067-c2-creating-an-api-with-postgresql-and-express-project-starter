import supertest from "supertest";

import app from "../../../server";
import { users } from '../users.routes';
import { UserInfo } from '../../../models/user';

const request = supertest(app);

const testUsers: UserInfo[] = [
  {username: "testUser1", password: "password"},
  {username: "testUser2", password: "password2", status: "admin"},
  {username: "testUser3", password: "password"},
];

const createAllUsers = async () => {
  for (let user of testUsers) {
    await users.create(user);
  }
}

const deleteAllUsers = async () => await users.delete();

const login = async (user: UserInfo) => {
  const response = await request.post('/users/login').send(user);
  return response.headers.authorization
}

export {createAllUsers, deleteAllUsers, login, testUsers, request}