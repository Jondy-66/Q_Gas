"use client";

import type { Control, SubmitHandler } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, Clock, CalendarDays, Boxes, Building, Store, Loader2 } from "lucide-react";
import type { PredictionFormData } from "@/lib/types";
import { SECTORS_QUITO, DAYS_OF_WEEK, ZONE_TYPES } from "@/lib/constants";

const formSchema = z.object({
  sector: z.string().min(1, "Sector es requerido"),
  hora_dia: z.coerce.number().min(0, "Hora debe ser >= 0").max(23, "Hora debe ser <= 23"),
  stock_actual: z.coerce.number().min(0, "Stock debe ser >= 0"),
  dia_semana: z.string().min(1, "Día de la semana es requerido"),
  es_laboral: z.boolean().default(false),
  demanda_comercial: z.string().min(1, "Tipo de zona es requerido"),
});

interface PredictionFormProps {
  onSubmit: (data: PredictionFormData) => Promise<void>;
  isLoading: boolean;
  selectedSectorValue: string | null;
  onSectorChange: (sectorValue: string) => void;
}

export function PredictionForm({ 
  onSubmit, 
  isLoading,
  selectedSectorValue,
  onSectorChange 
}: PredictionFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<PredictionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sector: selectedSectorValue || "",
      hora_dia: new Date().getHours(),
      stock_actual: 0,
      dia_semana: new Date().getDay() === 0 ? "6" : (new Date().getDay() -1 ).toString(), // Sunday is 0, map to 6. Monday is 1, map to 0 etc.
      es_laboral: new Date().getDay() >=1 && new Date().getDay() <=5, // Monday to Friday
      demanda_comercial: "0", // Default to Residencial
    },
  });

  const processSubmit: SubmitHandler<PredictionFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Flame className="mr-2 h-7 w-7 text-muted-foreground" />
          Ingresar Datos de Entrega
        </CardTitle>
        <CardDescription>
          Complete el formulario para predecir la demanda de gas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="sector" className="flex items-center mb-1">
              <MapPinIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              Sector de Entrega
            </Label>
            <Controller
              name="sector"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    onSectorChange(value);
                  }} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger id="sector" aria-label="Sector de Entrega">
                    <SelectValue placeholder="Seleccione un sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS_QUITO.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.sector && <p className="text-sm text-destructive mt-1">{errors.sector.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hora_dia" className="flex items-center mb-1">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                Hora del Día (0-23)
              </Label>
              <Controller
                name="hora_dia"
                control={control}
                render={({ field }) => <Input id="hora_dia" type="number" {...field} aria-describedby="hora_dia-error"/>}
              />
              {errors.hora_dia && <p id="hora_dia-error" className="text-sm text-destructive mt-1">{errors.hora_dia.message}</p>}
            </div>
            <div>
              <Label htmlFor="stock_actual" className="flex items-center mb-1">
                <Boxes className="mr-2 h-5 w-5 text-muted-foreground" />
                Stock Actual (cilindros)
              </Label>
              <Controller
                name="stock_actual"
                control={control}
                render={({ field }) => <Input id="stock_actual" type="number" {...field} aria-describedby="stock_actual-error" />}
              />
              {errors.stock_actual && <p id="stock_actual-error" className="text-sm text-destructive mt-1">{errors.stock_actual.message}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="dia_semana" className="flex items-center mb-1">
              <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
              Día de la Semana
            </Label>
            <Controller
              name="dia_semana"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <SelectTrigger id="dia_semana" aria-label="Día de la Semana">
                    <SelectValue placeholder="Seleccione un día" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.dia_semana && <p className="text-sm text-destructive mt-1">{errors.dia_semana.message}</p>}
          </div>

          <div>
            <Label htmlFor="demanda_comercial" className="flex items-center mb-1">
              <Building className="mr-2 h-5 w-5 text-muted-foreground" />
              Tipo de Zona
            </Label>
            <Controller
              name="demanda_comercial"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <SelectTrigger id="demanda_comercial" aria-label="Tipo de Zona">
                    <SelectValue placeholder="Seleccione tipo de zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONE_TYPES.map((zone) => (
                      <SelectItem key={zone.value} value={zone.value}>
                        {zone.label === "Comercial" && <Store className="inline-block mr-2 h-4 w-4" />}
                        {zone.label === "Residencial" && <Building className="inline-block mr-2 h-4 w-4" />}
                        {zone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.demanda_comercial && <p className="text-sm text-destructive mt-1">{errors.demanda_comercial.message}</p>}
          </div>
          
          <div className="flex items-center space-x-2">
            <Controller
              name="es_laboral"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="es_laboral"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Es día laboral"
                />
              )}
            />
            <Label htmlFor="es_laboral" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Es día laboral
            </Label>
          </div>
          {errors.es_laboral && <p className="text-sm text-destructive mt-1">{errors.es_laboral.message}</p>}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Prediciendo...
              </>
            ) : (
              "Predecir Entrega"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// MapPinIcon as an inline SVG component
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
