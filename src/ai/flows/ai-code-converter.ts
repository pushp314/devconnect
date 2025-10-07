'use server';
/**
 * @fileOverview This file defines a Genkit flow for converting code from one programming language to another.
 *
 * - aiCodeConverter - A function that takes a code snippet, source language, and target language, and returns the converted code.
 * - AICodeConverterInput - The input type for the aiCodeConverter function.
 * - AICodeConverterOutput - The return type for the aiCodeConverter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AICodeConverterInputSchema = z.object({
  code: z.string().describe('The code snippet to convert.'),
  sourceLanguage: z.string().describe('The source programming language.'),
  targetLanguage: z.string().describe('The target programming language.'),
});
export type AICodeConverterInput = z.infer<typeof AICodeConverterInputSchema>;

const AICodeConverterOutputSchema = z.object({
  code: z.string().describe('The converted code snippet.'),
});
export type AICodeConverterOutput = z.infer<typeof AICodeConverterOutputSchema>;

export async function aiCodeConverter(
  input: AICodeConverterInput
): Promise<AICodeConverterOutput> {
  return aiCodeConverterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCodeConverterPrompt',
  input: { schema: AICodeConverterInputSchema },
  output: { schema: AICodeConverterOutputSchema },
  prompt: `You are an expert programmer specializing in code conversion between languages.
You will be given a code snippet, a source language, and a target language.
Your task is to convert the code snippet to the target language, ensuring correctness and idiomatic style.

Source Language: {{{sourceLanguage}}}
Target Language: {{{targetLanguage}}}

Source Code:
\`\`\`
{{{code}}}
\`\`\`

Converted Code:`,
});

const aiCodeConverterFlow = ai.defineFlow(
  {
    name: 'aiCodeConverterFlow',
    inputSchema: AICodeConverterInputSchema,
    outputSchema: AICodeConverterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
