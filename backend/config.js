import dotenv from 'dotenv';
dotenv.config();
export const PORT = process.env.EXPRESS_PORT || 8000;
export const SECRET = process.env.SECRET_KEY || '';
export const CONFIDENCE_THRESHOLD = process.env.CONFIDENCE_THRESHOLD || 1.3;
export const VECTOR_STORE_PATH = process.env.VECTOR_STORE_PATH || './vector-stores';
