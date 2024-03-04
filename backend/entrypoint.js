import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import ProductRouter from "./routers/productRouter.js";
import ShoppingRouter from "./routers/shoppingRouter.js";


const root = express();


root.listen(PORT);
root.use(express.json());
root.use(trace);
root.use(cors());

root.use("/product", ProductRouter);
root.use("/shopping", ShoppingRouter);

function trace(req, res, next) {
    const traceId = req.query.traceId ?? new Date().getTime();
    req.traceId = traceId;
    console.log(`Received request from URL ${req.originalUrl} with traceId ${traceId}`);
    next();
}
console.log(`Express application started in ${PORT}`);
