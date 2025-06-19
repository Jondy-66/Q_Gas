import { Flame } from "lucide-react";

export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground py-6 shadow-md">
      <div className="container mx-auto flex items-center justify-center sm:justify-start">
        <Flame size={40} className="mr-3 text-primary-foreground" />
        <h1 className="text-3xl font-bold font-headline text-center sm:text-left">
          Predicción silenciosa de demanda de gas en Quito
        </h1>
      </div>
    </header>
  );
}
