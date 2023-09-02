import type { NextApiRequest, NextApiResponse } from 'next';
import { queryLanguageModel, formatOpenAIInput } from './index';
import { getDocumentFromCollectionById } from '../history/[id]';
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    const { message, userId } = JSON.parse(req.body) as { message: string, userId: string};
    const { id } = req.query as { id: string};
    var doc = await getDocumentFromCollectionById("chat", id, userId);
    if (!doc) {
        return res.status(404).json({
            error: "No conversation found with id: " + id
        });
    }
    let { userLabel, chatGPTLabel, endToken, startPrompt, history } = doc;

    let prompt = formatOpenAIInput(startPrompt, history, endToken, userLabel, 