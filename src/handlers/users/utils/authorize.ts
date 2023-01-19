import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { UserInfo } from "../../../models/user";

interface UserPayload extends JwtPayload{
  user?: UserInfo
}

const TOKEN_SECRET = <unknown>process.env.TOKEN_SECRET as string;

const authorize = (privilege?: 'user'|'admin') => {
  const authorize = (req: Request, res: Response, next: ()=>void) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { username } = req.params || req.body;
  
    try {
      const { user }  = jwt.verify(<string>token, TOKEN_SECRET) as UserPayload;

      if (privilege === 'admin'
          && user?.status === 'admin'
          && user?.username)
        next();

      else if (privilege === 'user' && user?.username)
        next()

      else if (privilege !== 'user'
          && (user?.username === username
              || user?.status === 'admin')
          )
        next();

      else
        res.status(403).json('Forbidden! User not authorized.');

    } catch(err) {
      console.error('Error! token cannot be verified');
      res.status(401).json('Not authorized');
    }
  }

  return authorize;
}

export {authorize, UserPayload};