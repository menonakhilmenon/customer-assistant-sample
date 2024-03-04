import { usingRedis } from "./redisService.js";
import { queryVectorDb , queryLLM} from "./vectorDbService.js";
import { CONFIDENCE_THRESHOLD } from "../config.js";

const PURPOSE_KEY = 'purpose';

export const createSession = async (purpose) => {
    const sessionId = String(new Date().getTime());
    await usingRedis(async client => {
        await client.hSet(sessionId, PURPOSE_KEY, purpose);
    })
    const items = (await queryVectorDb(purpose, 5))
        // TODO: Refine CONFIDENCE_THRESHOLD and uncomment following line
        // .filter(i => i[1] < CONFIDENCE_THRESHOLD)
        .map(i => {
            return {
                type: i[0].pageContent,
                productId: i[0].metadata.productId,
                distance: i[1]
            }
        });
    return { sessionId, items };
}

export const getRecommendations = async (items, purpose) => {
    //TODO: Store these in redis so we can avoid querying vectorDB everytime
    const results = await queryVectorDb(purpose, 5);
    let itemsList = results.filter(i => i[1] < CONFIDENCE_THRESHOLD).map(i => i[0].pageContent).join(", ");
    if (!itemsList.length) {
        itemsList = 'NA';
    }
    return await queryLLM(items, itemsList, purpose);
}


export const getSession = async (req) => {
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
