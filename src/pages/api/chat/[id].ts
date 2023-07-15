import type { NextApiRequest, NextApiResponse } from 'next';
import { queryLanguageModel, formatOpenAIInput } from './index';
import { getDocumentFromCollectionById } from '../history/[id]';
import { MongoCli