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
  const client = new MongoClient(process.env.MONGO_URL || '');
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(collectionName);
    const cursor = collection
      .find({
        userId: userId,