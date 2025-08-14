'use server';

/**
 * @fileOverview Suggests products to the customer based on their conversation and purchase history.
 *
 * - suggestProducts - A function that suggests products.
 * - SuggestProductsInput - The input type for the suggestProducts function.
 * - SuggestProductsOutput - The return type for the suggestProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductsInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The history of the conversation with the customer.'),
  purchaseHistory: z
    .string()
    .describe('The customer purchase history, if any.'),
});
export type SuggestProductsInput = z.infer<typeof SuggestProductsInputSchema>;

const SuggestProductsOutputSchema = z.object({
  suggestedProducts: z
    .array(z.string())
    .describe('The list of products to suggest to the customer.'),
});
export type SuggestProductsOutput = z.infer<typeof SuggestProductsOutputSchema>;

export async function suggestProducts(input: SuggestProductsInput): Promise<SuggestProductsOutput> {
  return suggestProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductsPrompt',
  input: {schema: SuggestProductsInputSchema},
  output: {schema: SuggestProductsOutputSchema},
  prompt: `You are an e-commerce product recommendation expert. Based on the customer's conversation history and past purchase history, you will suggest products that the customer might be interested in.

Conversation History: {{{conversationHistory}}}

Purchase History: {{{purchaseHistory}}}

Suggest a list of relevant products:`,
});

const suggestProductsFlow = ai.defineFlow(
  {
    name: 'suggestProductsFlow',
    inputSchema: SuggestProductsInputSchema,
    outputSchema: SuggestProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
