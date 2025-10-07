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
