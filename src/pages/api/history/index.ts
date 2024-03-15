import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { userId } = req.query as { userId: string };
    const sessionList = await fetchRecentDocuments("chat", userId);
    return res.status(200).json(sessionList);
}

async function fetchRecentDocuments(collectionName: string, userId: string) {
  const 