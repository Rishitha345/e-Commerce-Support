'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering customer questions using a knowledge base.
 *
 * - answerFromKnowledgeBase - A function that answers customer questions using a knowledge base.
 * - AnswerFromKnowledgeBaseInput - The input type for the answerFromKnowledgeBase function.
 * - AnswerFromKnowledgeBaseOutput - The return type for the answerFromKnowledgeBase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFromKnowledgeBaseInputSchema = z.object({
  question: z.string().describe('The customer question.'),
  knowledgeBase: z.string().describe('The knowledge base content.'),
});
export type AnswerFromKnowledgeBaseInput = z.infer<typeof AnswerFromKnowledgeBaseInputSchema>;

const AnswerFromKnowledgeBaseOutputSchema = z.object({
  answer: z.string().describe('The answer to the question from the knowledge base.'),
});
export type AnswerFromKnowledgeBaseOutput = z.infer<typeof AnswerFromKnowledgeBaseOutputSchema>;

export async function answerFromKnowledgeBase(input: AnswerFromKnowledgeBaseInput): Promise<AnswerFromKnowledgeBaseOutput> {
  return answerFromKnowledgeBaseFlow(input);
}

const answerFromKnowledgeBasePrompt = ai.definePrompt({
  name: 'answerFromKnowledgeBasePrompt',
  input: {schema: AnswerFromKnowledgeBaseInputSchema},
  output: {schema: AnswerFromKnowledgeBaseOutputSchema},
  prompt: `You are a customer support agent answering questions from a knowledge base.

  Knowledge Base:
  {{knowledgeBase}}

  Question: {{question}}

  Answer:`, 
});

const answerFromKnowledgeBaseFlow = ai.defineFlow(
  {
    name: 'answerFromKnowledgeBaseFlow',
    inputSchema: AnswerFromKnowledgeBaseInputSchema,
    outputSchema: AnswerFromKnowledgeBaseOutputSchema,
  },
  async input => {
    const {output} = await answerFromKnowledgeBasePrompt(input);
    return output!;
  }
);
