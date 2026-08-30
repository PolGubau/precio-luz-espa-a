import { PriceDashboard } from "@/components/price-dashboard";
import { normalizeReePrices } from "@/lib/prices";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

function getMadridDate() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Madrid",
    year: "numeric",
  }).formatToParts(new Date());
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;
  const day = getPart("day");
  const month = getPart("month");
  const year = getPart("year");

  if (!day || !month || !year) {
    throw new Error("No se ha podido calcular la fecha actual.");
  }

  return `${year}-${month}-${day}`;
}

async function fetchPrices(date: string) {
  const searchParams = new URLSearchParams({
    end_date: `${date}T23:59`,
    geo_ids: "8741",
    start_date: `${date}T00:00`,
    time_trunc: "hour",
  });
  const response = await fetch(
    `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?${searchParams}`,
    { next: { revalidate: 900 } }
  );

  if (!response.ok) {
    throw new Error("No se han podido obtener los precios.");
  }

  return normalizeReePrices(await response.json());
}

const getPrices = unstable_cache(fetchPrices, ["pvpc-prices-pcb"], {
  revalidate: 900,
});

export default async function Home() {
  const todayDate = getMadridDate();
  const prices = await getPrices(todayDate);
  const currentHour = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hourCycle: "h23",
    timeZone: "Europe/Madrid",
  }).format(new Date());
  const dataDate = prices[0].date;
  const savedAt = new Date().toISOString();

  return (
    <PriceDashboard
      currentHour={currentHour}
      dataDate={dataDate}
      prices={prices}
      savedAt={savedAt}
    />
  );
}
