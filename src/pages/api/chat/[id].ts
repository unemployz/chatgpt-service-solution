import type { NextApiRequest, NextApiResponse } from 'next';
import { queryLanguageModel, formatOpenAIInput } from './index';
import { getDocumentFromCollectionById } from '../history/[id]';
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>