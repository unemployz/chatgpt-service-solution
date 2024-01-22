import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { id, userId } = req.query;
    const collection = await getDocumentFromCollectionById("chat", id, userId);
    if (!collection) {
        return res.status(200).json({
            history: []
        });
    }
    collection.history.shift();
    collecti