import type { Sector } from './types';

export const SECTORS_QUITO: Sector[] = [
  { value: "Calderón", label: "Calderón", lat: -0.0900, lng: -78.4300 },
  { value: "Carapungo", label: "Carapungo", lat: -0.0750, lng: -78.4400 },
  { value: "La Ofelia", label: "La Ofelia", lat: -0.1100, lng: -78.4900 },
  { value: "Cotocollao", label: "Cotocollao", lat: -0.1000, lng: -78.5000 },
  { value: "El Condado", label: "El Condado", lat: -0.0800, lng: -78.5000 },
];

export const DAYS_OF_WEEK = [
  { value: "0", label: "Lunes" },
  { value: "1", label: "Martes" },
  { value: "2", label: "Miércoles" },
  { value: "3", label: "Jueves" },
  { value: "4", label: "Viernes" },
  { value: "5", label: "Sábado" },
  { value: "6", label: "Domingo" },
];

export const ZONE_TYPES = [
  { value: "0", label: "Residencial" },
  { value: "1", label: "Comercial" },
];

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export const FLASK_API_URL = "https://gas-silencioso-api.onrender.com/predecir";
