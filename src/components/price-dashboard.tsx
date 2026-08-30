"use client";

import { getHourStart, type PriceHour } from "@/lib/prices";
import { type CSSProperties, type PointerEvent, useState } from "react";
import { TbBolt, TbCalculator, TbChevronDown, TbChevronUp, TbClock } from "react-icons/tb";
import { PwaControls } from "./pwa-controls";

type PriceDashboardProps = {
  currentHour: string;
  dataDate: string;
  prices: PriceHour[];
  savedAt: string;
};

type PriceBand = 0 | 1 | 2 | 3 | 4;
type PriceGroup = { band: PriceBand; hours: PriceHour[]; startIndex: number };

const CHART_WIDTH = 360;
const CHART_HEIGHT = 164;
const CHART_PADDING = 18;
const bandLabels = ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"];
const appliances = [
  { consumption: 0.7, duration: 90, id: "washing-machine", label: "Lavadora" },
  { consumption: 1, duration: 120, id: "dishwasher", label: "Lavavajillas" },
  { consumption: 1.5, duration: 60, id: "oven", label: "Horno" },
  { consumption: 2, duration: 60, id: "dryer", label: "Secadora" },
  { consumption: 1, duration: 60, id: "custom", label: "Otro" },
];

const priceFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

const euroFormatter = new Intl.NumberFormat("es-ES", {
  currency: "EUR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: "currency",
});

function formatPrice(price: number, units: string) {
  return `${priceFormatter.format(price)} ${units}`;
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Madrid",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function getPriceRatio(price: number, minPrice: number, maxPrice: number) {
  const range = maxPrice - minPrice;
  return range === 0 ? 0.5 : (price - minPrice) / range;
}

function getBand(price: number, minPrice: number, maxPrice: number): PriceBand {
  return Math.min(4, Math.floor(getPriceRatio(price, minPrice, maxPrice) * 5)) as PriceBand;
}

function getColor(ratio: number) {
  const hue = Math.round(140 - ratio * 140);
  return `hsl(${hue} 74% 90%)`;
}

function getGroupStyle(group: PriceGroup, minPrice: number, maxPrice: number): CSSProperties {
  const stops = group.hours.map((hour, index) => {
    const position = group.hours.length === 1 ? 0 : (index / (group.hours.length - 1)) * 100;
    return `${getColor(getPriceRatio(hour.price, minPrice, maxPrice))} ${position}%`;
  });

  return {
    backgroundImage: `linear-gradient(180deg, ${stops.join(", ")})`,
  };
}

function getChartColor(price: number, minPrice: number, maxPrice: number) {
  const hue = Math.round(140 - getPriceRatio(price, minPrice, maxPrice) * 140);
  return `hsl(${hue} 76% 40%)`;
}

function groupPrices(prices: PriceHour[], minPrice: number, maxPrice: number) {
  const groups: PriceGroup[] = [];

  prices.forEach((hour, index) => {
    const band = getBand(hour.price, minPrice, maxPrice);
    const previousGroup = groups.at(-1);

    if (previousGroup?.band === band) {
      previousGroup.hours.push(hour);
      return;
    }

    groups.push({ band, hours: [hour], startIndex: index });
  });

  return groups;
}

function getTimeInMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function calculateUsageCost(
  prices: PriceHour[],
  startTime: string,
  duration: number,
  consumption: number
) {
  const start = getTimeInMinutes(startTime);
  const end = start + duration;

  if (!Number.isFinite(start) || consumption <= 0 || end > prices.length * 60) {
    return null;
  }

  return prices.reduce((total, hour, index) => {
    const hourStart = index * 60;
    const overlap = Math.max(0, Math.min(end, hourStart + 60) - Math.max(start, hourStart));
    return total + (consumption * overlap * hour.price) / duration;
  }, 0);
}

function findBestStart(prices: PriceHour[], duration: number, consumption: number) {
  let best: { cost: number; start: number } | null = null;

  for (let start = 0; start <= prices.length * 60 - duration; start += 15) {
    const cost = calculateUsageCost(prices, formatTime(start), duration, consumption);
    if (cost !== null && (best === null || cost < best.cost)) {
      best = { cost, start };
    }
  }

  return best;
}

function UsageCalculator({
  currentHour,
  maxPrice,
  minPrice,
  prices,
}: {
  currentHour: string;
  maxPrice: number;
  minPrice: number;
  prices: PriceHour[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [applianceId, setApplianceId] = useState(appliances[0].id);
  const [consumption, setConsumption] = useState(appliances[0].consumption);
  const [duration, setDuration] = useState(appliances[0].duration);
  const [startTime, setStartTime] = useState(`${currentHour}:00`);
  const cost = calculateUsageCost(prices, startTime, duration, consumption);
  const bestStart = findBestStart(prices, duration, consumption);
  const startTimeInMinutes = getTimeInMinutes(startTime);
  const startHourIndex = Number.isFinite(startTimeInMinutes)
    ? Math.min(prices.length - 1, Math.floor(startTimeInMinutes / 60))
    : 0;
  const resultColor = getColor(getPriceRatio(prices[startHourIndex].price, minPrice, maxPrice));

  function selectAppliance(id: string) {
    const appliance = appliances.find((item) => item.id === id);
    if (!appliance) return;

    setApplianceId(id);
    setConsumption(appliance.consumption);
    setDuration(appliance.duration);
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgb(15,23,42,0.06)]" aria-labelledby="calculator-title">
      <button
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <TbCalculator aria-hidden="true" size={21} />
          </span>
          <span>
            <span className="block font-semibold text-slate-950" id="calculator-title">Calcula un uso</span>
            <span className="mt-0.5 block text-xs text-slate-500">Cuánto cuesta poner algo a una hora concreta.</span>
          </span>
        </span>
        {isOpen ? <TbChevronUp aria-hidden="true" className="text-slate-500" size={20} /> : <TbChevronDown aria-hidden="true" className="text-slate-500" size={20} />}
      </button>

      {isOpen && (
        <div className="space-y-4 px-4 pb-4">
          <div>
            <label className="text-xs font-semibold text-slate-700" htmlFor="appliance">Qué vas a usar</label>
            <select
              className="mt-1.5 w-full rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-sky-500 focus:ring-2"
              id="appliance"
              onChange={(event) => selectAppliance(event.target.value)}
              value={applianceId}
            >
              {appliances.map((appliance) => <option key={appliance.id} value={appliance.id}>{appliance.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-700" htmlFor="start-time">
              Hora de inicio
              <input className="mt-1.5 w-full rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-sky-500 focus:ring-2" id="start-time" onChange={(event) => setStartTime(event.target.value)} step="900" type="time" value={startTime} />
            </label>
            <label className="text-xs font-semibold text-slate-700" htmlFor="consumption">
              Consumo (kWh)
              <input className="mt-1.5 w-full rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-sky-500 focus:ring-2" id="consumption" min="0.1" onChange={(event) => setConsumption(Number(event.target.value))} step="0.1" type="number" value={consumption} />
            </label>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">Duración</p>
            <div className="mt-1.5 grid grid-cols-4 gap-2">
              {[30, 60, 90, 120].map((minutes) => (
                <button
                  aria-pressed={duration === minutes}
                  className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${duration === minutes ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                  key={minutes}
                  onClick={() => setDuration(minutes)}
                  type="button"
                >
                  {minutes < 60 ? "30 min" : `${minutes / 60} h`}
                </button>
              ))}
            </div>
          </div>
          {cost === null ? (
            <p className="rounded-2xl bg-amber-50 px-3 py-3 text-sm text-amber-950">
              {consumption <= 0
                ? "Indica un consumo mayor que cero para calcular el coste."
                : "Ese uso termina mañana. Elige una hora o duración que quepa en las franjas disponibles."}
            </p>
          ) : (
            <div className="rounded-2xl p-4 text-slate-950" style={{ backgroundColor: resultColor }}>
              <p className="text-xs font-semibold text-slate-700">Coste de energía estimado</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{euroFormatter.format(cost)}</p>
              {bestStart && <p className="mt-2 text-sm text-slate-800">Mejor a las {formatTime(bestStart.start)}: {euroFormatter.format(bestStart.cost)}</p>}
            </div>
          )}
          <p className="text-xs leading-5 text-slate-500">Estimación con el consumo repartido de forma uniforme. No incluye término fijo, impuestos ni otros cargos.</p>
        </div>
      )}
    </section>
  );
}

function PriceChart({
  maxPrice,
  minPrice,
  prices,
  selectedIndex,
  onSelect,
}: {
  maxPrice: number;
  minPrice: number;
  onSelect: (index: number) => void;
  prices: PriceHour[];
  selectedIndex: number;
}) {
  const range = maxPrice - minPrice || 1;
  const plotHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const chartPoints = prices.map((hour, index) => ({
    hour,
    x:
      CHART_PADDING +
      (index * (CHART_WIDTH - CHART_PADDING * 2)) / Math.max(prices.length - 1, 1),
    y: CHART_PADDING + ((maxPrice - hour.price) / range) * plotHeight,
  }));
  const path = chartPoints.map(({ x, y }, index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");
  const area = `${path} L ${chartPoints.at(-1)?.x} ${CHART_HEIGHT - CHART_PADDING} L ${CHART_PADDING} ${CHART_HEIGHT - CHART_PADDING} Z`;
  const selectedPoint = chartPoints[selectedIndex] ?? chartPoints[0];

  function selectFromPointer(event: PointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    onSelect(Math.round(relativeX * (prices.length - 1)));
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgb(15,23,42,0.06)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold tracking-tight text-slate-950">Precio de hoy</h2>
          <p className="mt-0.5 text-xs text-slate-500">Toca o desliza sobre la línea para ver cada hora.</p>
        </div>
        <div className="rounded-xl bg-slate-900 px-2.5 py-1.5 text-right text-white">
          <p className="text-xs text-slate-300">{selectedPoint.hour.hour}</p>
          <p className="text-sm font-semibold tabular-nums">
            {formatPrice(selectedPoint.hour.price, selectedPoint.hour.units)}
          </p>
        </div>
      </div>
      <svg
        aria-label="Gráfico interactivo del precio por hora"
        aria-valuemax={prices.length - 1}
        aria-valuemin={0}
        aria-valuenow={selectedIndex}
        aria-valuetext={`${selectedPoint.hour.hour}: ${formatPrice(selectedPoint.hour.price, selectedPoint.hour.units)}`}
        className="block h-auto w-full touch-none cursor-crosshair rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onSelect(Math.max(0, selectedIndex - 1));
          if (event.key === "ArrowRight") onSelect(Math.min(prices.length - 1, selectedIndex + 1));
        }}
        onPointerDown={selectFromPointer}
        onPointerMove={(event) => {
          if (event.buttons > 0) selectFromPointer(event);
        }}
        role="slider"
        tabIndex={0}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      >
        <defs>
          <linearGradient id="price-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.2, 0.5, 0.8].map((position) => (
          <line key={position} stroke="#e2e8f0" strokeDasharray="3 4" x1={CHART_PADDING} x2={CHART_WIDTH - CHART_PADDING} y1={CHART_PADDING + plotHeight * position} y2={CHART_PADDING + plotHeight * position} />
        ))}
        <path d={area} fill="url(#price-area)" />
        {chartPoints.slice(1).map((point, index) => {
          const previousPoint = chartPoints[index];

          return <line key={point.hour.hour} stroke={getChartColor((previousPoint.hour.price + point.hour.price) / 2, minPrice, maxPrice)} strokeLinecap="round" strokeWidth="3" x1={previousPoint.x} x2={point.x} y1={previousPoint.y} y2={point.y} />;
        })}
        <line stroke="#0f172a" strokeDasharray="3 4" strokeOpacity="0.35" x1={selectedPoint.x} x2={selectedPoint.x} y1={CHART_PADDING} y2={CHART_HEIGHT - CHART_PADDING} />
        <circle cx={selectedPoint.x} cy={selectedPoint.y} fill="white" r="5" stroke="#0f172a" strokeWidth="3" />
        {[0, 6, 12, 18, prices.length - 1].map((index) => (
          <text fill="#64748b" fontSize="10" key={index} textAnchor={index === 0 ? "start" : index === prices.length - 1 ? "end" : "middle"} x={chartPoints[index].x} y={CHART_HEIGHT - 2}>
            {getHourStart(prices[index].hour)}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function PriceDashboard({ currentHour, dataDate, prices, savedAt }: PriceDashboardProps) {
  const currentIndex = Math.max(0, prices.findIndex((hour) => getHourStart(hour.hour) === currentHour));
  const [selectedIndex, setSelectedIndex] = useState(currentIndex);
  const minPrice = Math.min(...prices.map((hour) => hour.price));
  const maxPrice = Math.max(...prices.map((hour) => hour.price));
  const averagePrice = prices.reduce((total, hour) => total + hour.price, 0) / prices.length;
  const cheapestHour = prices.find((hour) => hour.price === minPrice) ?? prices[0];
  const mostExpensiveHour = prices.find((hour) => hour.price === maxPrice) ?? prices[0];
  const featuredHour = prices[currentIndex];
  const groupedPrices = groupPrices(prices, minPrice, maxPrice);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <section className="bg-[linear-gradient(155deg,#1295d8_0%,#56c9ef_52%,#dff4fb_100%)] text-white">
        <div className="mx-auto w-full max-w-[430px] px-5 pb-7 pt-5">
          <h1 className="sr-only">Precio de la luz hoy por horas</h1>
          <div className="pt-8">
            <p className="text-sm text-white/80">Hoy, {formatDate(dataDate)}</p>
            <div className="mt-1 flex items-end gap-2">
              <p className="text-5xl font-semibold tracking-[-0.06em] tabular-nums">{priceFormatter.format(featuredHour.price)}</p>
              <p className="mb-1.5 text-sm font-medium text-white/85">€/kWh</p>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/90">
              <TbBolt aria-hidden="true" size={17} />
              Ahora · {featuredHour.hour}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/90 p-3 text-slate-900 shadow-sm backdrop-blur">
              <p className="text-xs font-medium text-slate-500">Más barata</p>
              <p className="mt-1 font-semibold tabular-nums">{formatPrice(minPrice, prices[0].units)}</p>
              <p className="mt-0.5 text-xs text-emerald-700">{getHourStart(cheapestHour.hour)}</p>
            </div>
            <div className="rounded-2xl bg-white/90 p-3 text-slate-900 shadow-sm backdrop-blur">
              <p className="text-xs font-medium text-slate-500">Más cara</p>
              <p className="mt-1 font-semibold tabular-nums">{formatPrice(maxPrice, prices[0].units)}</p>
              <p className="mt-0.5 text-xs text-rose-700">{getHourStart(mostExpensiveHour.hour)}</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-white/85">Media: {formatPrice(averagePrice, prices[0].units)}</p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[430px] space-y-5 px-4 pb-8 pt-5">
        <UsageCalculator currentHour={currentHour} maxPrice={maxPrice} minPrice={minPrice} prices={prices} />
        <PriceChart maxPrice={maxPrice} minPrice={minPrice} onSelect={setSelectedIndex} prices={prices} selectedIndex={selectedIndex} />
        <PwaControls dataDate={dataDate} savedAt={savedAt} />
        <section aria-labelledby="hours-title">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <h2 className="font-semibold text-slate-950" id="hours-title">Todas las horas</h2>
              <p className="mt-0.5 text-xs text-slate-500">Agrupadas por rango, sin ocultar ningún tramo.</p>
            </div>
            <p className="text-xs text-slate-500">€/kWh</p>
          </div>
          <ul className="space-y-3" aria-label="Todas las franjas horarias agrupadas por precio">
            {groupedPrices.map((group) => {
              const groupMin = Math.min(...group.hours.map((hour) => hour.price));
              const groupMax = Math.max(...group.hours.map((hour) => hour.price));
              const label = groupMin === minPrice ? "Más barata" : groupMax === maxPrice ? "Más cara" : bandLabels[group.band];

              return (
                <li className="overflow-hidden rounded-3xl shadow-sm" key={`${group.startIndex}-${group.band}`} style={getGroupStyle(group, minPrice, maxPrice)}>
                  <div className="flex items-center justify-between px-4 pb-1.5 pt-3 text-xs font-semibold text-slate-800">
                    <span>{label}</span>
                    <span>{group.hours.length} {group.hours.length === 1 ? "hora" : "horas"}</span>
                  </div>
                  <ul>
                    {group.hours.map((hour, index) => {
                      const hourIndex = group.startIndex + index;
                      const isSelected = hourIndex === selectedIndex;

                      return (
                        <li key={hour.hour}>
                          <button
                            aria-pressed={isSelected}
                            className={`relative grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected ? "bg-slate-950 text-white" : "text-slate-950 hover:bg-white/25"} ${index > 0 ? "before:absolute before:left-4 before:right-4 before:top-0 before:h-px before:bg-white/45" : ""}`}
                            onClick={() => setSelectedIndex(hourIndex)}
                            type="button"
                          >
                            <span className="flex items-center gap-2 font-semibold">
                              <TbClock aria-hidden="true" className={isSelected ? "text-white/70" : "text-slate-600"} size={18} />
                              <time>{hour.hour}</time>
                              {getHourStart(hour.hour) === currentHour && <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isSelected ? "bg-white/20" : "bg-white/70"}`}>Ahora</span>}
                            </span>
                            <span className="text-right font-bold tabular-nums">{formatPrice(hour.price, hour.units)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </section>
        <footer className="space-y-1 pb-2 text-center text-xs text-slate-500">
          <p>Fuente: Red Eléctrica de España · Se actualiza automáticamente.</p>
          <p>
            Hecha por{" "}
            <a className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950" href="https://doscientos.es" rel="noreferrer" target="_blank">
              doscientos
            </a>
            <span aria-hidden="true"> · </span>
            <a className="text-slate-500 underline decoration-slate-200 underline-offset-2 hover:text-slate-700" href="https://pogubau.com" rel="noreferrer" target="_blank">
              Pol Gubau
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
