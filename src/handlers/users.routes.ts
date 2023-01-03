import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { User, UserRegistry } from "../models/user";
import { auth_admin, auth_user } from "./utils/authorize";

const TOKEN_SECRET = <unknown>process.env.TOKEN_SECRET as string;

const auth = Router();
const users = new UserRegistry();

const index = async (_req: Request, res: Response) => {
  const allUsers = await users.index();
  res.json(allUsers);
};

const create = async (req: Request, res: Response) => {
  const user = await users.create(req.body);
  const token = jwt.sign(user, TOKEN_SECRET);
  res.set({Authorization: `Bearer ${token}`})
     .json(user);
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  try{
    const user = await users.authenticate(username, password);
    const token: string = jwt.sign({ user: user }, TOKEN_SECRET);
    
    res.set({Authorization: `Bearer ${token}`})
       .json('Success! Logged in');

  } catch(err) {
    res.status(404)
       .json({error: "User not found"});
  }
}

const show = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user: User = await users.show(username);
  
  if (user.username === username)
    res.json(username);
  
  else
    res.status(403).json('Forbidden!');
}

auth.route('/')
    .get(auth_admin, index)
    .post(create);

auth.post('/auth', login);

auth.get('/user/:username', auth_user, show);

export default auth;