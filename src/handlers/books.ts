import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { BookShelf } from '../models/book';

const books = express.Router();

const shelf = new BookShelf;

const authorize = (req: Request, res: Response, next: () => void) => {
  const token = req.headers.authorization?.split(' ')[1];
  try{
    jwt.verify(<string>token, <string>process.env.TOKEN_SECRET);
  } catch(err) {
    res.status(401).json({error: "Invalid token"});
  }
  next()
}

const index = async (_req: Request, res: Response) => {
  const books = await shelf.index();
  res.json(books);
};

const create = async (req:Request, res: Response) => {
  // const { title, author, isbn, year } = req.body;
  const newBook = await shelf.create(req.body);
  res.status(201).json({success: `New book ${req.body.title} added!`})
}

books.route('/')
     .get(index)
     .post(authorize, create);

export default books;