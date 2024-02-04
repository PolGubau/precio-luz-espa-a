"use client"; // Error components must be Client Components

import { Button } from "pol-ui";
import { useEffect } from "react";

export default function ErrorBound({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className=" flex flex-col gap-6 ">
      <h2>Precios actualizándose</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Volver a probar
      </Button>
    </div>
  );
}
