"use client";

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { FormattedPastPrediction, PastPredictionSummaryInput, PastPredictionSummaryOutput, StoredPrediction } from '@/lib/types';
import { summarizePastPredictions } from '@/ai/flows/summarize-past-predictions';
import { Bot, LineChart } from 'lucide-react';

const chartConfig = {
  demand: {
    label: 'Demanda (cilindros)',
    color: 'hsl(var(--primary))',
  },
};

interface PastPredictionsChartProps {
  predictions: StoredPrediction[];
}

function formatPredictionsForChart(predictions: StoredPrediction[]): FormattedPastPrediction[] {
  return predictions.map((p, index) => ({
    date: new Date(p.timestamp).toLocaleDateString('es-EC', { month: 'short', day: 'numeric' }) + ` (${index + 1})`,
    demand: Math.round(p.prediccion_cilindros), 
    sector: p.formData.sector, 
    time: p.formData.hora_dia,
  })).slice(-10); 
}

function formatPredictionsForAISummary(predictions: StoredPrediction[]): string {
  return predictions
    .map(p => `Sector: ${p.formData.sector}, Fecha: ${new Date(p.timestamp).toISOString().split('T')[0]}, Hora: ${p.formData.hora_dia}, Demanda: ${Math.round(p.prediccion_cilindros)}`)
    .join('; ');
}


export function PastPredictionsDisplay({ predictions }: PastPredictionsChartProps) {
  const [chartData, setChartData] = useState<FormattedPastPrediction[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    setChartData(formatPredictionsForChart(predictions));

    if (predictions.length >= 3) { 
      setIsLoadingSummary(true);
      const summaryInput: PastPredictionSummaryInput = {
        pastPredictions: formatPredictionsForAISummary(predictions),
      };
      summarizePastPredictions(summaryInput)
        .then((output: PastPredictionSummaryOutput) => {
          setAiSummary(output.summary);
        })
        .catch(error => {
          console.error("Error generating AI summary:", error);
          setAiSummary("No se pudo generar el resumen de tendencias.");
        })
        .finally(() => {
          setIsLoadingSummary(false);
        });
    } else {
      setAiSummary(null);
    }
  }, [predictions]);

  if (predictions.length === 0) {
    return null; 
  }

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <LineChart className="mr-2 h-6 w-6 text-muted-foreground" />
            Historial de Predicciones Recientes
          </CardTitle>
          <CardDescription>Visualización de las últimas 10 demandas estimadas.</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 6)} 
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    label={{ value: 'Cilindros', angle: -90, position: 'insideLeft', offset: 10 }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                              formatter={(value, name, item) => (
                                <>
                                  <div className="font-medium">{item.payload.date?.substring(item.payload.date.indexOf('('))} {chartConfig[name as keyof typeof chartConfig]?.label}</div>
                                  <div>Demanda: {value}</div>
                                  <div>Sector: {item.payload.sector}</div>
                                  <div>Hora: {item.payload.time}h</div>
                                </>
                              )}
                            />}
                  />
                  <Bar dataKey="demand" fill="var(--color-demand)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-muted-foreground text-center py-4">No hay suficientes datos para mostrar el gráfico.</p>
          )}
        </CardContent>
      </Card>

      {aiSummary && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline">
              <Bot className="mr-2 h-6 w-6 text-accent" />
              Resumen de Tendencias (IA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <p className="text-muted-foreground">Generando resumen...</p>
            ) : (
              <p className="text-sm text-foreground/80 whitespace-pre-line">{aiSummary}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
