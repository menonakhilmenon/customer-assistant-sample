import { createClient } from "redis";

export const usingRedis = async (callback) => {
    const redisUrl = process.env.REDIS_URL;
    const client = createClient({ url: redisUrl });
    await client.connect();
    await callback(client);
    client.disconnect();
}
