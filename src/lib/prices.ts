export type PriceHour = {
  date: string;
  hour: string;
  isCheap: boolean;
  price: number;
  units: string;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function hourToMinutes(hour: string) {
  const match = /^(\d{1,2}):(\d{2})/.exec(hour);

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function parsePriceHour(value: unknown): PriceHour | null {
  if (!isRecord(value)) {
    return null;
  }

  const { date, hour, price, units } = value;

  if (
    typeof date !== "string" ||
    typeof hour !== "string" ||
    hourToMinutes(hour) === Number.MAX_SAFE_INTEGER ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    typeof units !== "string"
  ) {
    return null;
  }

  return {
    date,
    hour,
    price,
    units,
    isCheap: value["is-cheap"] === true,
  };
}

function parseReePriceHour(value: unknown): PriceHour | null {
  if (!isRecord(value)) {
    return null;
  }

  const { datetime, value: price } = value;
  const match =
    typeof datetime === "string"
      ? /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/.exec(datetime)
      : null;

  if (!match || typeof price !== "number" || !Number.isFinite(price)) {
    return null;
  }

  const startHour = Number(match[2]);
  const endHour = String((startHour + 1) % 24).padStart(2, "0");

  return {
    date: match[1],
    hour: `${match[2]}:${match[3]}-${endHour}:${match[3]}`,
    isCheap: false,
    price: price / 1000,
    units: "€/kWh",
  };
}

function validatePrices(prices: PriceHour[]) {
  const sortedPrices = prices.sort(
    (first, second) => hourToMinutes(first.hour) - hourToMinutes(second.hour)
  );

  // Hay días con cambio de hora que tienen 23 o 25 franjas.
  if (sortedPrices.length < 23) {
    throw new Error("No se han recibido todas las franjas horarias.");
  }

  if (new Set(sortedPrices.map((price) => price.date)).size !== 1) {
    throw new Error("Los precios recibidos pertenecen a fechas distintas.");
  }

  return sortedPrices;
}

export function normalizePrices(payload: unknown): PriceHour[] {
  if (!isRecord(payload)) {
    throw new Error("La respuesta de precios no tiene el formato esperado.");
  }

  const prices = Object.values(payload)
    .map(parsePriceHour)
    .filter((price): price is PriceHour => price !== null);

  return validatePrices(prices);
}

export function normalizeReePrices(payload: unknown): PriceHour[] {
  if (!isRecord(payload) || !Array.isArray(payload.included)) {
    throw new Error("La respuesta de precios no tiene el formato esperado.");
  }

  const pvpc = payload.included.find(
    (entry) => isRecord(entry) && entry.id === "1001" && isRecord(entry.attributes)
  );

  if (!isRecord(pvpc) || !isRecord(pvpc.attributes) || !Array.isArray(pvpc.attributes.values)) {
    throw new Error("No se han recibido los precios PVPC.");
  }

  const prices = validatePrices(
    pvpc.attributes.values
      .map(parseReePriceHour)
      .filter((price): price is PriceHour => price !== null)
  );
  const averagePrice =
    prices.reduce((total, price) => total + price.price, 0) / prices.length;

  return prices.map((price) => ({
    ...price,
    isCheap: price.price < averagePrice,
  }));
}

export function getHourStart(hour: string) {
  return hour.slice(0, 5);
}
