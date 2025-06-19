
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, TrendingUp, BarChart3, AlertCircle, Info } from "lucide-react";
import type { ApiPredictionResponse } from "@/lib/types";

interface ResultsDisplayProps {
  results: ApiPredictionResponse;
  onNewPrediction: () => void;
}

export function ResultsDisplay({ results, onNewPrediction }: ResultsDisplayProps) {
  const demand = Math.round(results.prediccion_cilindros);
  // Assume results.probabilidad_urgencia is already a percentage value (e.g., 50 for 50%)
  const urgencyProbability = (results.probabilidad_urgencia).toFixed(2);
  const isUrgent = results.prediccion_urgencia.toUpperCase() === "URGENTE";

  return (
    <Card className="w-full max-w-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <TrendingUp className="mr-2 h-7 w-7 text-muted-foreground" />
          Resultados de la Predicción
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
          <div className="flex items-center text-lg">
            <BarChart3 className="mr-3 h-6 w-6 text-muted-foreground" />
            <span>Demanda estimada de cilindros:</span>
            <strong className="ml-2 text-xl">{demand}</strong>
          </div>
          <div className={`flex items-center text-lg p-2 rounded-md ${isUrgent ? 'text-destructive' : 'text-accent'}`}>
            {isUrgent ? (
              <AlertTriangle className="mr-3 h-6 w-6 text-destructive" />
            ) : (
              <CheckCircle2 className="mr-3 h-6 w-6 text-accent" />
            )}
            <span>Clasificación de urgencia:</span>
            <strong className="ml-2 text-xl">{results.prediccion_urgencia.toUpperCase()}</strong>
          </div>
          <div className="flex items-center text-lg">
            <AlertCircle className="mr-3 h-6 w-6 text-muted-foreground" />
            <span>Probabilidad de urgencia:</span>
            <strong className="ml-2 text-xl">{urgencyProbability}%</strong>
          </div>
        </div>

        <div className="p-4 border-l-4 border-accent bg-accent/20 rounded-md">
          <div className="flex">
            <Info className="h-6 w-6 mr-3 text-accent shrink-0" />
            <p className="text-sm text-foreground">
              Esta predicción ayuda a planificar rutas silenciosas de distribución de gas en la ciudad de Quito, 
              alineándose con las metas 11.1 y 11.6 de los ODS para ciudades y comunidades sostenibles, 
              reduciendo la contaminación acústica y mejorando la calidad de vida urbana.
            </p>
          </div>
        </div>

        <Button onClick={onNewPrediction} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
          Realizar Nueva Predicción
        </Button>
      </CardContent>
    </Card>
  );
}
