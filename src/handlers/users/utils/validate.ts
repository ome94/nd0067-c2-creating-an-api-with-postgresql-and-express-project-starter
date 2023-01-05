import { Request, Response } from "express";

import { users } from "../users.routes";

export const validateInput = (req: Request, res: Response, next: ()=>void) => {
  const { username, password } = req.body;
  console.log()
  
  if (!username)
    res.status(400)
       .json('invalid username input');
  else if(!password)
    res.status(400)
       .json('invalid password input');

  next();
}

export const checkExisting = async (req: Request, res: Response, next: ()=>void) => {
  const { username } = req.body;
  const existingUsers = await users.index();
  const userExists = existingUsers.some(user => user.username === username);
  
  if (userExists)
    res.status(400)
      .json('Error! User already exists');
  
  else next();    
}

