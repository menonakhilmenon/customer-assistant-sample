import express from 'express';
import asyncHandler from "express-async-handler";
import { createSession, getRecommendations, getSession } from '../services/shoppingService.js';

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
    const { purpose } = req.body;
    res.status(200).send(await createSession(purpose));
}));

router.put("/:session/", asyncHandler(async (req, res) => {
    //TODO: Move to middleware
    if (!await getSession(req, res)) {
        res.status(404).send({ msg: "Session Not Found" });
        return;
    }
    const session = req.session;
    const { items } = req.body;
    res.status(200).send(await getRecommendations(items, session.purpose));
}));
export default router;