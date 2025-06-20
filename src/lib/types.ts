export interface PredictionFormData {
  sector: string; // Will be mapped to number
  hora_dia: number;
  stock_actual: number;
  dia_semana: string; // Will be mapped to number
  es_laboral: boolean;
  demanda_comercial: string; // Will be mapped to number
}

export interface ApiPredictionRequest {
  sector: string;
  hora_dia: number;
  stock_actual: number;
  dia_semana: number;
  es_laboral: number; // 0 or 1
  demanda_comercial: number; // 0 or 1
}

export interface ApiPredictionResponse {
  prediccion_cilindros: number;
  prediccion_urgencia: "URGENTE" | "NORMAL" | string;
  probabilidad_urgencia: number;
}

export interface Sector {
  value: string;
  label: string;
  lat: number;
  lng: number;
  radius: number; // Radius in meters for the circle
}

export interface StoredPrediction extends ApiPredictionResponse {
  id: string;
  timestamp: string;
  formData: PredictionFormData;
}

export interface FormattedPastPrediction {
  date: string;
  demand: number;
  sector: string;
  time: number;
}

// For summarizePastPredictions AI flow
export interface PastPredictionSummaryInput {
  pastPredictions: string;
}

export interface PastPredictionSummaryOutput {
  summary: string;
}
