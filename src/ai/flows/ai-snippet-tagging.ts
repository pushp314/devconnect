'use server';
/**
 * @fileOverview This file defines a Genkit flow for automatically analyzing code snippets and suggesting relevant tags.
 *
 * - aiSnippetTagging - A function that takes a code snippet and its description and returns a list of suggested tags.
 * - AISnippetTaggingInput - The input type for the aiSnippetTagging function.
 * - AISnippetTaggingOutput - The return type for the aiSnippetTagging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISnippetTaggingInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
  description: z.string().describe('The description of the code snippet.'),
});
export type AISnippetTaggingInput = z.infer<typeof AISnippetTaggingInputSchema>;

const AISnippetTaggingOutputSchema = z.object({
  tags: z.array(z.string()).describe('A list of suggested tags for the code snippet.'),
});
export type AISnippetTaggingOutput = z.infer<typeof AISnippetTaggingOutputSchema>;

export async function aiSnippetTagging(input: AISnippetTaggingInput): Promise<AISnippetTaggingOutput> {
  return aiSnippetTaggingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSnippetTaggingPrompt',
  input: {schema: AISnippetTaggingInputSchema},
  output: {schema: AISnippetTaggingOutputSchema},
  prompt: `You are an expert software developer specializing in code analysis and tagging.

You will analyze the provided code snippet and its description to suggest relevant tags.
These tags will help other developers discover the code snippet.

Consider the programming language, frameworks, libraries, and algorithms used in the code.
Also, consider the overall purpose and functionality of the code.

Return a list of tags that are most relevant and descriptive.

Code Snippet:
```
{{{code}}}
```

Description: {{{description}}}

Tags:`, // Removed array square brackets from prompt because array is not handled properly
});

const aiSnippetTaggingFlow = ai.defineFlow(
  {
    name: 'aiSnippetTaggingFlow',
    inputSchema: AISnippetTaggingInputSchema,
    outputSchema: AISnippetTaggingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
