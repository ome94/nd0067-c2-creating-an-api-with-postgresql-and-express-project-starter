import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { User } from "../../models/user";
import { authorize } from "./utils/authorize";
import { checkExisting, validateInput } from "./utils/validate";

const TOKEN_SECRET = <unknown>process.env.TOKEN_SECRET as string;

const auth = Router();
export const users = new User();

const index = async (_req: Request, res: Response) => {
  const allUsers = await users.index();
  res.json(allUsers);
};

const create = async (req: Request, res: Response) => {
  const user = await users.create(req.body);
  const token = jwt.sign({ user }, TOKEN_SECRET);
  res.status(201)
     .set({Authorization: `Bearer ${token}`})
     .json(user);
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  try {
    const user = await users.authenticate(username, password);
    const token: string = user ? jwt.sign({ user }, TOKEN_SECRET):'';
    if(token)
      res.set({Authorization: `Bearer ${token}`})
         .json('Success! Logged in');
    
    else res.status(404).json('Error! Invalid user')

  } catch(err) {
    res.status(404)
       .json({error: "User not found"});
  }
}

const show = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await users.show(username);
  
  if (user!.username === username)
    res.json(user);
  
  else
    res.status(403).json('Forbidden!');
}

auth.route('/')
    .get(authorize('admin'), index)
    .post(validateInput, checkExisting, create);

auth.post('/login', login);

auth.get('/user/:username', authorize(), show);

export default auth;