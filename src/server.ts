import express, { Request, Response } from 'express'
import cors from 'cors';
import bodyParser from 'body-parser'
import auth from './handlers/users/users.routes';
import products from './handlers/products/products.routes';

const app: express.Application = express()
const port = process.env.ENV?.toLowerCase() === 'test' ? 
              3001 : 3000;

const address: string = `0.0.0.0:${port}`

const corsOptions: cors.CorsOptions = {
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use((req: Request, _res: Response, next: () => void) => {
    console.log(req.method, req.url);
    next();
});

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.use('/users', auth);
app.use('/products', products)

app.listen(port, function () {
    console.log(`starting app on: ${address}`)
})

export default app;