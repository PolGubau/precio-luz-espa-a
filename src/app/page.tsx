import { TbClock } from "react-icons/tb";

interface HourData {
  date: string;
  hour: string;
  "is-cheap": boolean;
  "is-under-avg": boolean;
  market: string;
  price: number;
  units: string;
}

type Data = {
  [key: string]: HourData;
};

async function getData() {
  const res = await fetch(
    "https://api.preciodelaluz.org/v1/prices/all?zone=PCB"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
export default async function Home() {
  const data = await getData();

  const arrayzedData = Object.keys(data).map((key) => data[key as keyof Data]);

  const maxPrice = Math.max(...arrayzedData.map((hour) => hour.price));
  const minPrice = Math.min(...arrayzedData.map((hour) => hour.price));

  const cheapestHour = arrayzedData.find((hour) => hour.price === minPrice);
  const mostExpensiveHour = arrayzedData.find(
    (hour) => hour.price === maxPrice
  );

  const avgPrice = Math.round(
    arrayzedData.reduce((acc, hour) => acc + hour.price, 0) /
      arrayzedData.length
  );
  return (
    <main className="flex min-h-screen flex-col gap-6 items-center justify-between p-6 text-center">
      <header className="flex flex-col gap-3 justify-center items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Precio de la luz {arrayzedData[0].date}
        </h1>
        <ul className="flex gap-2 flex-wrap items-center justify-center">
          <li className="bg-yellow-100 rounded-full px-3 py-1 w-fit flex gap-1">
            <span className="hidden sm:flex">Precio</span>
            Mínimo: {minPrice}€ ({cheapestHour?.hour}h)
          </li>
          <li className="bg-orange-100 rounded-full px-3 py-1 w-fit flex gap-1">
            <span className="hidden sm:flex">Precio</span>
            Medio: {avgPrice}€
          </li>
          <li className="bg-red-100 rounded-full px-3 py-1 w-fit flex gap-1">
            <span className="hidden sm:flex">Precio</span>
            Máximo: {maxPrice}€ ({mostExpensiveHour?.hour}h)
          </li>
        </ul>
      </header>

      <ul className="flex flex-col w-full gap-1 md:max-w-xl">
        {arrayzedData.map((hour) => {
          const isCheap = hour["is-cheap"];

          // Background color based on price scale from min to max, the min price will be green and the max price will be red
          const priceScale = (hour.price - minPrice) / (maxPrice - minPrice);
          const bgColor = `rgba(${255 * priceScale}, ${
            255 * (1 - priceScale)
          }, 0, 0.5)`;

          return (
            <li
              key={hour.hour}
              style={{ backgroundColor: bgColor }}
              className="rounded-xl p-2 flex gap-4 items-center justify-between "
            >
              <div className="flex justify-start items-center gap-4">
                <header className="flex gap-1 items-center">
                  <TbClock size={20} />
                  <h1 className="text-lg sm:text-2xl">{hour.hour}</h1>
                </header>
                {isCheap && (
                  <span className="bg-green-400 text-green-800 rounded-xl px-3 py-1">
                    Barato
                  </span>
                )}
              </div>
              <h2>
                <span className="font-bold text-lg sm:text-2xl">
                  {" "}
                  {hour.price}
                </span>
                {hour.units}
              </h2>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
