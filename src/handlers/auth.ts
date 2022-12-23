import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { UserRegistry } from "../models/user";

const auth = Router();
const users = new UserRegistry();

const index = async (req: Request, res: Response) => {
  const allUsers = await users.index();
  res.json(allUsers);
};

const create = async (req: Request, res: Response) => {
  const { username, password, firstname, lastname } = req.body;
  const user = await users.create({username, password, firstname, lastname});
  res.json(user);
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await users.auth(username, password);
  const token: string | null = user ? 
                jwt.sign({ user: user }, <unknown>process.env.TOKEN_SECRET as string) :
                JSON.stringify({error: "User not found"});

  res.json(token);
}

auth.route('/')
    .get(index)
    .post(login);

auth.post('/', create);

export default auth;