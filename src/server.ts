import express, { Request, Response } from 'express'
import cors from 'cors';
import bodyParser from 'body-parser'
import films from './handlers/films';
import books from './handlers/books';
import auth from './handlers/users';

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

const corsOptions: cors.CorsOptions = {
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use((req: Request, _res: Response, next: <T>() => void) => {
    console.log(req.url);
    next();
});

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.use('/users', auth);
app.use('/books', books);
app.use('/films', films);

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})
