const LAST_ID = 'LAST_ID';
import { usingRedis } from "./redisService.js";
import { addProductToVectorDb } from "./vectorDbService.js";

export const addProduct = async(productType) => {
    let lastId = 0;
    await usingRedis(async client => {
        lastId = Number((await client.get(LAST_ID)) || 0);
        await client.set(LAST_ID, lastId+1);
    });
    await addProductToVectorDb(lastId, productType);
};