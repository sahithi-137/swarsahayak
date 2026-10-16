import { matchLocalQuery } from '../src/services/localAssistant.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.method === 'POST' ? req.body?.query : req.query?.query;
  const language = (req.method === 'POST' ? req.body?.language : req.query?.language) || 'hi';
  const category = req.method === 'POST' ? req.body?.category : req.query?.category;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const result = matchLocalQuery(query.trim(), language, category);
  return res.status(200).json(result);
}
