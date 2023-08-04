import express, {Express,Request,Response, NextFunction} from 'express';
import http from 'http';
import path from 'path';

const port: number = 5005;

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request Logging on Console
app.use("/", (req:Request, res:Response, next: NextFunction) => {
    console.log({
        method: req.method,
        url: req.url
    });

    next()
});


// Running Server
http.createServer(app).listen(port, () => {
    console.log(`app listening at https://localhost:${port}`);
});