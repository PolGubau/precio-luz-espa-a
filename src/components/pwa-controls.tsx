"use client";

import { Button } from "@doscientos/ui";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  TbArrowDownToArc,
  TbDeviceMobile,
  TbShare3,
  TbWifiOff,
} from "react-icons/tb";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PwaControlsProps = {
  dataDate: string;
  savedAt: string;
};

function formatSavedAt(savedAt: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(new Date(savedAt));
}

function subscribeToOnlineStatus(onStoreChange: () => void) {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);

  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}

function getOnlineStatus() {
  return navigator.onLine;
}

function subscribeToInstallationStatus(onStoreChange: () => void) {
  const displayMode = window.matchMedia("(display-mode: standalone)");
  window.addEventListener("appinstalled", onStoreChange);
  displayMode.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener("appinstalled", onStoreChange);
    displayMode.removeEventListener("change", onStoreChange);
  };
}

function getInstallationStatus() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function PwaControls({ dataDate, savedAt }: PwaControlsProps) {
  const isOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineStatus,
    () => true
  );
  const isInstalled = useSyncExternalStore(
    subscribeToInstallationStatus,
    getInstallationStatus,
    () => null
  );
  const isAppleMobile =
    typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const markAsInstalled = () => {
      setInstallPrompt(null);
    };
    const saveInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", saveInstallPrompt);
    window.addEventListener("appinstalled", markAsInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then((registration) => {
          const assetUrls = performance
            .getEntriesByType("resource")
            .map((entry) => entry.name)
            .filter((assetUrl) => {
              const url = new URL(assetUrl);
              return (
                url.origin === window.location.origin &&
                url.pathname.startsWith("/_next/static/")
              );
            });

          registration.active?.postMessage({
            type: "CACHE_URLS",
            urls: [window.location.href, ...assetUrls],
          });
        })
        .catch(() => undefined);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", saveInstallPrompt);
      window.removeEventListener("appinstalled", markAsInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  const showInstallCard =
    isInstalled === false && (installPrompt !== null || isAppleMobile);

  return (
    <>
      {!isOnline && (
        <p
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          Sin conexión. Estás viendo los datos de {dataDate}; esta página se
          guardó el {formatSavedAt(savedAt)}.
        </p>
      )}
      {showInstallCard && (
        <section
          aria-labelledby="install-app-title"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-amber-300">
              <TbDeviceMobile aria-hidden="true" size={22} />
            </div>
            <div>
              <h2
                className="font-semibold tracking-tight text-slate-950"
                id="install-app-title"
              >
                Instala Precio Luz
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                Ábrela desde la pantalla de inicio y consulta la última lista
                guardada incluso sin conexión.
              </p>
            </div>
          </div>

          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <TbArrowDownToArc aria-hidden="true" className="text-slate-500" size={18} />
              Acceso directo al precio de hoy
            </li>
            <li className="flex items-center gap-2">
              <TbWifiOff aria-hidden="true" className="text-slate-500" size={18} />
              Últimos datos disponibles offline
            </li>
          </ul>

          {installPrompt ? (
            <Button className="mt-4" onPress={installApp}>
              <TbArrowDownToArc aria-hidden="true" size={18} />
              Instalar app
            </Button>
          ) : (
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <TbShare3 aria-hidden="true" size={18} />
              En Safari, toca Compartir y elige “Añadir a pantalla de inicio”.
            </p>
          )}
        </section>
      )}
    </>
  );
}
