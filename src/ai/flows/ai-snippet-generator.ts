'use server';
/**
 * @fileOverview Defines a Genkit flow for generating a code snippet from a description.
 *
 * - aiSnippetGenerator - Generates a code snippet based on a user's description.
 * - AISnippetGeneratorInput - Input type for the generator.
 * - AISnippetGeneratorOutput - Output type for the generator.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AISnippetGeneratorInputSchema = z.object({
  description: z.string().describe('The description of the code snippet to generate.'),
});
export type AISnippetGeneratorInput = z.infer<typeof AISnippetGeneratorInputSchema>;

const AISnippetGeneratorOutputSchema = z.object({
  code: z.string().describe('The generated code snippet.'),
});
export type AISnippetGeneratorOutput = z.infer<
  typeof AISnippetGeneratorOutputSchema
>;

export async function aiSnippetGenerator(
  input: AISnippetGeneratorInput
): Promise<AISnippetGeneratorOutput> {
  return aiSnippetGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSnippetGeneratorPrompt',
  input: { schema: AISnippetGeneratorInputSchema },
  output: { schema: AISnippetGeneratorOutputSchema },
  prompt: `You are an expert software developer. A user wants to generate a code snippet.
Based on the following description, generate a high-quality, reusable code snippet.
Assume the target language is TypeScript with React, unless specified otherwise.

Description: {{{description}}}

Generated Code:`,
});

const aiSnippetGeneratorFlow = ai.defineFlow(
  {
    name: 'aiSnippetGeneratorFlow',
    inputSchema: AISnippetGeneratorInputSchema,
    outputSchema: AISnippetGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
