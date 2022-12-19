import express, { Request, Response } from "express";
import { FilmStore } from "../models/dvd_rental";

const films = express.Router();
const store = new FilmStore();

const index = async (_req: Request, res: Response) => {
  const films = await store.index();
  res.json(films);
}

const show = async (req: Request, res: Response) => {
  const film_id = parseInt(req.params.id);
  const film = await store.show(film_id);
  res.json(film)
}

films.get('/', index);
films.get('/:id', show);

export default films