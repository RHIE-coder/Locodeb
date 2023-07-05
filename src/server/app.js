import express from 'express';
import http from 'http';
import path from 'path';

const app = express();
const port = 5005

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request Logging on Console
app.use("/", (req, res) => {
    console.log({
        method: req.method,
        url: req.url
    });
    req.next()
});

// Running Server
http.createServer(app).listen(port, () => {
    console.log(`app listening at https://localhost:${port}`);
});