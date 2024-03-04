import express from 'express';
import asyncHandler from "express-async-handler";
import { addProduct } from "../services/productService.js";

const router = express.Router();

router.put("/", asyncHandler(async (req, res) => {
    const { productType } = req.body;
    if (!productType) {
        res.status(400).send({ msg: 'Product Type not specified' });
        return;
    }
    await addProduct(productType);
    res.status(200).send();
}))

export default router;