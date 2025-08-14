import { config } from 'dotenv';
config();

import '@/ai/flows/answer-from-knowledge-base.ts';
import '@/ai/flows/summarize-feedback.ts';
import '@/ai/flows/suggest-products.ts';