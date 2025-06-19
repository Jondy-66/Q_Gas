
// Summarize trends from past demand predictions to anticipate future demand.

'use server';

/**
 * @fileOverview Summarizes trends from past demand predictions.
 *
 * - summarizePastPredictions - A function that summarizes past demand predictions.
 * - SummarizePastPredictionsInput - The input type for the summarizePastPredictions function.
 * - SummarizePastPredictionsOutput - The return type for the summarizePastPredictions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePastPredictionsInputSchema = z.object({
  pastPredictions: z
    .string()
    .describe(
      'A string containing historical gas demand prediction data, including sector, date, time, and demand level.'
    ),
});
export type SummarizePastPredictionsInput = z.infer<
  typeof SummarizePastPredictionsInputSchema
>;

const SummarizePastPredictionsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the trends and patterns in the past gas demand predictions.'
    ),
});
export type SummarizePastPredictionsOutput = z.infer<
  typeof SummarizePastPredictionsOutputSchema
>;

export async function summarizePastPredictions(
  input: SummarizePastPredictionsInput
): Promise<SummarizePastPredictionsOutput> {
  return summarizePastPredictionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePastPredictionsPrompt',
  input: {schema: SummarizePastPredictionsInputSchema},
  output: {schema: SummarizePastPredictionsOutputSchema},
  prompt: `Eres un experto en el análisis de predicciones de demanda de gas. Dada la siguiente información histórica, proporciona un resumen conciso en ESPAÑOL de las tendencias y patrones clave. Incluye días pico, sectores de alta demanda y cualquier correlación entre las condiciones climáticas y el consumo de gas, si la información lo permite.\n\nDatos Históricos: {{{pastPredictions}}}`,
});

const summarizePastPredictionsFlow = ai.defineFlow(
  {
    name: 'summarizePastPredictionsFlow',
    inputSchema: SummarizePastPredictionsInputSchema,
    outputSchema: SummarizePastPredictionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
