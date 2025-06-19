
"use server";

import type { ApiPredictionRequest, ApiPredictionResponse } from "@/lib/types";
import { FLASK_API_URL } from "@/lib/constants";

export async function getGasPrediction(
  data: ApiPredictionRequest
): Promise<ApiPredictionResponse> {
  let response: Response;
  try {
    response = await fetch(FLASK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    });
  } catch (networkError) {
    console.error("Error de red al intentar contactar la API de predicción:", networkError);
    if (networkError instanceof Error) {
      throw new Error(`Error de red al contactar API: ${networkError.message}`);
    }
    throw new Error("Error de red desconocido al contactar API de predicción.");
  }

  const responseText = await response.text();

  if (!response.ok) {
    console.error(`Error de API ${response.status} ${response.statusText}. Cuerpo:`, responseText);
    throw new Error(`Error de API: ${response.status} ${response.statusText}. Detalles: ${responseText}`);
  }

  try {
    const result: ApiPredictionResponse = JSON.parse(responseText);

    // Validate the structure of the parsed JSON
    if (
      typeof result.prediccion_cilindros !== 'number' || // Changed from prediccion_demanda
      typeof result.prediccion_urgencia !== 'string' ||
      typeof result.probabilidad_urgencia !== 'number'
    ) {
      console.error("Respuesta de API inesperada (estructura no válida) aunque el estado HTTP sea OK. Cuerpo:", responseText);
      throw new Error(`Respuesta de API con formato inesperado. Detalles: ${responseText}`);
    }
    return result;
  } catch (parseError) {
    console.error("Error al parsear la respuesta JSON de la API. Respuesta recibida:", responseText);
    if (parseError instanceof Error) {
      // It's possible the parseError.message already contains "Unexpected token < in JSON at position 0" or similar if it's HTML
      // Or it might be a more specific error if the structure check failed.
      // The current throw new Error logic is good because it includes responseText.
      if (parseError.message.includes("Respuesta de API con formato inesperado")) {
         throw parseError; // Re-throw the more specific error from structure validation
      }
      throw new Error(`Error al procesar respuesta de API (JSON inválido): ${parseError.message}. Respuesta original: ${responseText}`);
    }
    throw new Error(`Error desconocido al procesar respuesta de API. Respuesta original: ${responseText}`);
  }
}
