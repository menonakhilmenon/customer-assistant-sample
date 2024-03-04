import express from 'express';
import { existsSync } from "fs";
import cors from 'cors';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import { createClient } from "redis";
import { RunnableSequence } from "@langchain/core/runnables";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { Document } from "@langchain/core/documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

dotenv.config();

const root = express();
const PORT = process.env.EXPRESS_PORT || 8000;
const SECRET = process.env.SECRET_KEY || '';
const CONFIDENCE_THRESHOLD = process.env.CONFIDENCE_THRESHOLD || 1.3;
const LAST_ID = process.env.CONFIDENCE_THRESHOLD || 1.0;
const VECTOR_STORE_PATH = process.env.VECTOR_STORE_PATH || './vector-stores';

const PURPOSE_KEY = 'purpose';

const MAIN_PROMPT = new PromptTemplate({
    template: "The following items already in the shopping cart (NA if there are no items): {itemsList}.\The following items are available in the shop {inventoryList}.\nThe purpose of shopping is : {purpose}. Tell me which of the items available would fit with the others (return no more than {limit}). Make sure to return only items in the list. Make sure the returned item is not already in the cart.\n{format_instructions}",
    inputVariables: ['itemsList', 'inventoryList', 'purpose', 'limit', 'format_instructions']
});

const PARSER = StructuredOutputParser.fromZodSchema(
    z.object({
        item: z.string().describe("item which would go along with the cart (make sure this is available in the shop)"),
        reason: z.string().describe("why the item was chosen"),
        confidence: z.string().describe("how confident you are with recommending this item, should be either HIGH or LOW"),
    })
);

const MODEL = new OpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    openAIApiKey: SECRET
});

const CHAIN = RunnableSequence.from([
    MAIN_PROMPT,
    MODEL,
    PARSER
]);

const VECTOR_STORE = await initializeVectorStore();

root.listen(PORT);
root.use(express.json());
root.use(trace);
root.use(cors());
root.get("/", (req, res) => {
    res.status(200).send('success');
});
console.log(process.env)

root.post("/shopping", asyncHandler(async (req, res) => {
    const { purpose } = req.body;
    const sessionId = String(new Date().getTime());
    await usingRedis(async client => {
        await client.hSet(sessionId, PURPOSE_KEY, purpose);
    })
    const items = (await queryVectorDb(purpose, 5))
        // .filter(i => i[1] < CONFIDENCE_THRESHOLD)
        .map(i => {
            return {
                type: i[0].pageContent,
                productId: i[0].metadata.productId,
                distance: i[1]
            }
        });
    res.status(200).send({ sessionId, items });
}));

root.put("/product", asyncHandler(async (req, res) => {
    let lastId = 0;
    await usingRedis(async client => {
        lastId = Number((await client.get(LAST_ID)) || 0);
        await client.set(LAST_ID, lastId+1);
    });
    const { productType } = req.body;
    if (!productType) {
        res.status(400).send({ msg: 'Product Type not specified' });
        return;
    }
    await addProductToVectorDb(lastId, productType);

    res.status(200).send();
}))


root.put("/shopping/:session/", asyncHandler(async (req, res) => {
    //TODO: Move to middleware
    if (!await getSession(req, res)) {
        res.status(404).send({ msg: "Session Not Found" });
        return;
    }
    const session = req.session;
    const { items } = req.body;
    const results = await queryVectorDb(session.purpose, 5);
    let itemsList = results.filter(i => i[1] < CONFIDENCE_THRESHOLD).map(i => i[0].pageContent).join(", ");
    if (!itemsList.length) {
        itemsList = 'NA';
    }
    res.status(200).send(await queryLLM(items, itemsList, session.purpose));
}));


console.log(`Express application started in ${PORT}`);

function trace(req, res, next) {
    const traceId = req.query.traceId ?? new Date().getTime();
    req.traceId = traceId;
    console.log(`Received request from URL ${req.originalUrl} with traceId ${traceId}`);
    next();
}

async function queryLLM(items, itemsList, purpose, limit = 3) {
    return await CHAIN.invoke({
        itemsList: items,
        inventoryList: itemsList,
        purpose: purpose,
        limit: limit,
        format_instructions: PARSER.getFormatInstructions()
    });
}

async function getSession(req, res) {
    const sessionId = req.params.session;
    if (!sessionId) {
        return false;
    }
    let sessionFound = false;
    await usingRedis(async client => {
        if (!(await client.exists(sessionId))) {
            sessionFound = false;
            return;
        } else {
            sessionFound = true;
        }
        const purpose = await client.hGet(sessionId, PURPOSE_KEY);
        req.session = {
            purpose: purpose,
            id: sessionId
        }
    })
    return sessionFound;
}

async function addProductToVectorDb(itemId, productType) {
    const docToAdd = new Document({
        pageContent: productType,
        metadata: { id: itemId },
    });
    try {
        await VECTOR_STORE.addDocuments(
            [
                docToAdd
            ]
        );
    } catch (e) {
        await VECTOR_STORE.delete({ ids: [id] });
        await VECTOR_STORE.addDocuments(
            [
                docToAdd
            ]
        );
    }
    await VECTOR_STORE.save(VECTOR_STORE_PATH);
}

async function queryVectorDb(query, k = 5) {
    return await VECTOR_STORE.similaritySearchWithScore(query, k);
}

async function usingRedis(callback) {
    const redisUrl = process.env.REDIS_URL;
    const client = createClient({ url: redisUrl });
    await client.connect();
    await callback(client);
    client.disconnect();
}

async function initializeVectorStore() {
    const openAIEmbeddings = new OpenAIEmbeddings({
        openAIApiKey: SECRET,
        modelName: 'text-embedding-3-small'
    });
    if (existsSync(VECTOR_STORE_PATH + '/faiss.index')) {
        return await FaissStore.load(
            VECTOR_STORE_PATH,
            openAIEmbeddings
        );
    } else {
        return new FaissStore(openAIEmbeddings, {});
    }

}