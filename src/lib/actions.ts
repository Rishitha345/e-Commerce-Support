'use server';

import { answerFromKnowledgeBase } from '@/ai/flows/answer-from-knowledge-base';
import type { Message } from '@/lib/types';

const KNOWLEDGE_BASE = `
Welcome to ShopAssist! Here are some frequently asked questions:

**Order & Shipping**
- **How can I track my order?** You will receive a tracking number via email once your order has shipped. You can also use the 'Track my order' quick action below.
- **What are your shipping options?** We offer standard (5-7 business days) and express (1-3 business days) shipping.
- **Do you ship internationally?** Yes, we ship to most countries worldwide.

**Returns & Refunds**
- **What is your return policy?** We accept returns within 30 days of purchase for a full refund, provided the item is in its original condition.
- **How do I start a return?** Please use the 'Start a return' quick action or visit the returns page on our website.

**Products**
- **Can you help me find a product?** Absolutely! Use the 'Search for products' quick action or just tell me what you're looking for.
- **Do you have any recommendations?** I can provide personalized recommendations based on your interests. Let me know what you like!

**Account & Payment**
- **What payment methods do you accept?** We accept all major credit cards, PayPal, and Apple Pay.
- **How do I update my account information?** You can update your details on your account page.
`;

export async function getAiResponse(messages: Message[]) {
  const userQuestion = messages[messages.length - 1]?.content;

  if (!userQuestion) {
    return "I'm sorry, I didn't get that. Could you please repeat your question?";
  }

  try {
    const response = await answerFromKnowledgeBase({
      question: userQuestion,
      knowledgeBase: KNOWLEDGE_BASE,
    });
    return response.answer;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm sorry, but I'm having trouble connecting right now. Please try again in a moment.";
  }
}
