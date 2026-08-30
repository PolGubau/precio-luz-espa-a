"use client";

import { Button } from "@doscientos/ui";
import { useEffect } from "react";

export default function ErrorBound({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-start justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        No hemos podido cargar los precios
      </h1>
      <p className="text-slate-600">
        Comprueba tu conexión e inténtalo de nuevo en unos instantes.
      </p>
      <Button onPress={reset}>Volver a probar</Button>
    </main>
  );
}
