"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/qgas/Header";
import { AppFooter } from "@/components/qgas/Footer";
import { PredictionForm } from "@/components/qgas/PredictionForm";
import { MapDisplay } from "@/components/qgas/MapDisplay";
import { ResultsDisplay } from "@/components/qgas/ResultsDisplay";
import { PastPredictionsDisplay } from "@/components/qgas/PastPredictionsChart";
import { useToast } from "@/hooks/use-toast";
import { getGasPrediction } from "./actions";
import type { PredictionFormData, ApiPredictionRequest, ApiPredictionResponse, StoredPrediction, Sector } from "@/lib/types";
import { SECTORS_QUITO } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [selectedSectorValue, setSelectedSectorValue] = useState<string | null>(SECTORS_QUITO[0]?.value || null);
  const [predictionResult, setPredictionResult] = useState<ApiPredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [pastPredictions, setPastPredictions] = useState<StoredPrediction[]>([]);

  useEffect(() => {
    // Load past predictions from localStorage on component mount
    const stored = localStorage.getItem("qgasPastPredictions");
    if (stored) {
      setPastPredictions(JSON.parse(stored));
    }
  }, []);

  const handleSectorChange = (sectorValue: string) => {
    setSelectedSectorValue(sectorValue);
  };

  const handlePredictionSubmit = async (formData: PredictionFormData) => {
    setIsLoading(true);
    setPredictionResult(null);

    const apiRequestData: ApiPredictionRequest = {
      sector: formData.sector,
      hora_dia: formData.hora_dia,
      stock_actual: formData.stock_actual,
      dia_semana: parseInt(formData.dia_semana, 10),
      es_laboral: formData.es_laboral ? 1 : 0,
      demanda_comercial: parseInt(formData.demanda_comercial, 10),
    };

    try {
      const result = await getGasPrediction(apiRequestData);
      setPredictionResult(result);

      // Store new prediction
      const newStoredPrediction: StoredPrediction = {
        ...result,
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        formData, 
      };
      const updatedPastPredictions = [newStoredPrediction, ...pastPredictions].slice(0, 20); // Keep last 20
      setPastPredictions(updatedPastPredictions);
      localStorage.setItem("qgasPastPredictions", JSON.stringify(updatedPastPredictions));

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      toast({
        title: "Error de Predicción",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPrediction = () => {
    setPredictionResult(null);
    // Optionally reset form fields here if PredictionForm doesn't do it itself on key change or similar
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-center md:items-start">
            <PredictionForm 
              onSubmit={handlePredictionSubmit} 
              isLoading={isLoading}
              selectedSectorValue={selectedSectorValue}
              onSectorChange={handleSectorChange}
            />
          </div>
          <div className="flex flex-col space-y-8">
            <MapDisplay selectedSectorValue={selectedSectorValue} />
            {predictionResult && (
              <ResultsDisplay results={predictionResult} onNewPrediction={handleNewPrediction} />
            )}
          </div>
        </div>
        
        {pastPredictions.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="mt-12">
              <PastPredictionsDisplay predictions={pastPredictions} />
            </div>
          </>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
