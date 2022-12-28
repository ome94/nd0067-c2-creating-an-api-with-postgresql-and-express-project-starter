import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { User, UserPayload } from "../../models/user";

const TOKEN_SECRET = <unknown>process.env.TOKEN_SECRET as string;

const auth_admin = (req: Request, res: Response, next: () => void) => {
  const token = req.headers.authorization?.split(' ')[0];

  try {
    const { user } = <unknown>jwt.verify(<string>token, TOKEN_SECRET) as UserPayload;
  
    if ((<User>user).status === 'admin') next();
    
    else{
      res.status(401).json('Not allowed');
    }

  } catch(err) {
    console.log(err);
  }
}


const auth_user = (req: Request, res: Response, next: () => void) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { username } = req.params || req.body;

  try {
    const { user } = <unknown>jwt.verify(<string>token, TOKEN_SECRET) as UserPayload;
  
    if (user?.username === username) next();
    
    else
      res.status(403).json('Forbidden! User not authorized.');

  } catch(err) {
    console.log(err);
    res.status(403).json('Not authorized')
  }
}


export {auth_admin, auth_user};