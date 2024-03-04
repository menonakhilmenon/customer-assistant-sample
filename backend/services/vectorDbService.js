import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { SECRET , VECTOR_STORE_PATH} from "../config.js";
import { existsSync } from "fs";
import { Document } from "@langchain/core/documents";
import { RunnableSequence } from "@langchain/core/runnables";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

const VECTOR_STORE = await initializeVectorStore();

export const addProductToVectorDb = async (itemId, productType) => {
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

export const queryVectorDb = async(query, k = 5) => {
    return await VECTOR_STORE.similaritySearchWithScore(query, k);
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


const MAIN_PROMPT = new PromptTemplate({
    template: "The following items already in the shopping cart (NA if there are no items): {itemsList}.\The following items are available in the shop {inventoryList}.\nThe purpose of shopping is : {purpose}. Tell me which of the items available would fit with the others (return no more than {limit}). Make sure to return only items in the list. Make sure the returned item is not already in the cart.\n{format_instructions}",
    inputVariables: ['itemsList', 'inventoryList', 'purpose', 'limit', 'format_instructions']
});

const PARSER = StructuredOutputParser.fromZodSchema(
    z.object({
        item: z.string().describe("item which would go along with the cart (make sure this is available in the shop)"),
        reason: z.string().describe("why the item was chosen explain in a friendly manner"),
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


export const queryLLM = async (items, itemsList, purpose, limit = 3) => {
    return await CHAIN.invoke({
        itemsList: items,
        inventoryList: itemsList,
        purpose: purpose,
        limit: limit,
        format_instructions: PARSER.getFormatInstructions()
    });
}
