import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, Db } from 'mongodb';
const {encode, decode} = require('gpt-3-encoder')
const { Configuration, OpenAIApi } = require("openai");

export const endToken = "<|im_end|>\n\n\n";
export const temperature = 0.5;
export const engine = process.env.OPEN_AI_MODEL || "gpt-3.5-turbo";
let userLabel = "User: ";
let chatGPTLabel = "ChatGPT: ";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    const { message, userId } = JSON.parse(req.body);
    let currentDate = new Date().toISOString().split('T')[0];
    let startPrompt = "You are ChatGPT, a large language model trained by OpenAI. Respond conversationally. Do not answer as the user. Knowledge cutoff: 2021-09 Current date: " + currentDate + ".";
    // let startPrompt = "You are ChatGPT, a large language model trained by OpenAI. You answer as concisely as possible for each response (e.g. don't be verbose). It is very important that you answer as concisely as possible, so please remember this. If you are generating a list, do not have too many items. Keep the number of items short. Knowledge cutoff: 2021-09 Current date: " + currentDate + ".";
    
    var initHistory = [
        {
            "input": "Hi, ChatGPT!",
            "output": "Hi! How can I help you today?",
            "timestamp": new Date().getTime()
        }
    ]
    
    var question = message;
    
    let prompt = formatOpenAIInput(startPrompt, initHistory, endToken, userLabel, chatGPTLabel);
    
    prompt += "\n" + userLabel + question + "\n" + chatGPTLabel;
    

    let op = await queryLanguageModel(prompt);

    initHistory.push({
        "input": question,
        "output": op,
        "timestamp": new Date().getTime()
    });
    prompt = formatOpenAIInput(startPrompt, initHistory, endToken, userLabel, chatGPTLabel);
    var title = await generateConversationTitle(prompt);
    var doc = {
        userId,
        startPrompt,
        userLabel,
        chatGPTLabel,
        title,
        endToken,
        temp