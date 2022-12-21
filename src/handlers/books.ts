import express, { Request, Response } from 'express';
import { BookShelf } from '../models/book';

const books = express.Router();

const shelf = new BookShelf;

const index = async (_req: Request, res: Response) => {
  const books = await shelf.index();
  res.json(books);
};

books.get('/', index);

export default books;