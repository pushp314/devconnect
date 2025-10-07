'use server';
/**
 * @fileOverview Server actions for AI-powered features.
 */

import {
  aiCodeConverter,
  AICodeConverterInput,
} from '@/ai/flows/ai-code-converter';
import {
  aiSnippetGenerator,
  AISnippetGeneratorInput,
} from '@/ai/flows/ai-snippet-generator';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to explain.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('The detailed explanation of the code.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;


const explainCodePrompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: { schema: ExplainCodeInputSchema },
  output: { schema: ExplainCodeOutputSchema },
  prompt: `You are an expert software developer and code reviewer.
A user has requested an explanation for the following code snippet.
Analyze the code and provide a clear, concise explanation of what it does, how it works, and potential use cases.
Break down complex parts and explain them in simple terms.

Code:
\`\`\`
{{{code}}}
\`\`\`

Explanation:`,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async (input) => {
    const { output } = await explainCodePrompt(input);
    return output!;
  }
);


export async function generateSnippetAction(input: AISnippetGeneratorInput) {
  try {
    const result = await aiSnippetGenerator(input);
    return { generatedCode: result.code };
  } catch (error) {
    console.error('Error in generateSnippetAction:', error);
    throw new Error('Failed to generate snippet with AI.');
  }
}

export async function convertCodeAction(input: AICodeConverterInput) {
  try {
    const result = await aiCodeConverter(input);
    return { convertedCode: result.code };
  } catch (error) {
    console.error('Error in convertCodeAction:', error);
    throw new Error('Failed to convert code with AI.');
  }
}


export async function explainCodeAction(input: ExplainCodeInput) {
  try {
    const result = await explainCodeFlow(input);
    return { explanation: result.explanation };
  } catch (error) {
    console.error('Error in explainCodeAction:', error);
    throw new Error('Failed to explain code with AI.');
  }
}
