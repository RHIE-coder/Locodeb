import express from 'express';
import blockchain from '../../blockchain';

const router = express.Router();

router.get("/balance/:address", (res, req)=> {
    const address = req.params.address;
})