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
export default async function Home() {
  // const data = await fetch(
  //   "https://api.preciodelaluz.org/v1/prices/all?zone=PCB"
  // )
  //   .then((response) => response.json())
  //   .then((data) => console.log(data));
  const data: Data = {
    "00-01": {
      date: "04-02-2024",
      hour: "00-01",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 117.07,
      units: "€/MWh",
    },
    "01-02": {
      date: "04-02-2024",
      hour: "01-02",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 117.07,
      units: "€/MWh",
    },
    "02-03": {
      date: "04-02-2024",
      hour: "02-03",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 117.98,
      units: "€/MWh",
    },
    "03-04": {
      date: "04-02-2024",
      hour: "03-04",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 118.51,
      units: "€/MWh",
    },
    "04-05": {
      date: "04-02-2024",
      hour: "04-05",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 117.37,
      units: "€/MWh",
    },
    "05-06": {
      date: "04-02-2024",
      hour: "05-06",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 116.64,
      units: "€/MWh",
    },
    "06-07": {
      date: "04-02-2024",
      hour: "06-07",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 116.34,
      units: "€/MWh",
    },
    "07-08": {
      date: "04-02-2024",
      hour: "07-08",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 115.14,
      units: "€/MWh",
    },
    "08-09": {
      date: "04-02-2024",
      hour: "08-09",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 117.17,
      units: "€/MWh",
    },
    "09-10": {
      date: "04-02-2024",
      hour: "09-10",
      "is-cheap": false,
      "is-under-avg": true,
      market: "PVPC",
      price: 102.5,
      units: "€/MWh",
    },
    "10-11": {
      date: "04-02-2024",
      hour: "10-11",
      "is-cheap": false,
      "is-under-avg": true,
      market: "PVPC",
      price: 81.27,
      units: "€/MWh",
    },
    "11-12": {
      date: "04-02-2024",
      hour: "11-12",
      "is-cheap": true,
      "is-under-avg": true,
      market: "PVPC",
      price: 74.74,
      units: "€/MWh",
    },
    "12-13": {
      date: "04-02-2024",
      hour: "12-13",
      "is-cheap": true,
      "is-under-avg": true,
      market: "PVPC",
      price: 67.4,
      units: "€/MWh",
    },
    "13-14": {
      date: "04-02-2024",
      hour: "13-14",
      "is-cheap": true,
      "is-under-avg": true,
      market: "PVPC",
      price: 67.82,
      units: "€/MWh",
    },
    "14-15": {
      date: "04-02-2024",
      hour: "14-15",
      "is-cheap": true,
      "is-under-avg": true,
      market: "PVPC",
      price: 67.2,
      units: "€/MWh",
    },
    "15-16": {
      date: "04-02-2024",
      hour: "15-16",
      "is-cheap": true,
      "is-under-avg": true,
      market: "PVPC",
      price: 65.16,
      units: "€/MWh",
    },
    "16-17": {
      date: "04-02-2024",
      hour: "16-17",
      "is-cheap": true,
      "is-under-avg": true,
      market: "PVPC",
      price: 79.96,
      units: "€/MWh",
    },
    "17-18": {
      date: "04-02-2024",
      hour: "17-18",
      "is-cheap": false,
      "is-under-avg": true,
      market: "PVPC",
      price: 93.94,
      units: "€/MWh",
    },
    "18-19": {
      date: "04-02-2024",
      hour: "18-19",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 118.36,
      units: "€/MWh",
    },
    "19-20": {
      date: "04-02-2024",
      hour: "19-20",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 130.92,
      units: "€/MWh",
    },
    "20-21": {
      date: "04-02-2024",
      hour: "20-21",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 180.6,
      units: "€/MWh",
    },
    "21-22": {
      date: "04-02-2024",
      hour: "21-22",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 169.32,
      units: "€/MWh",
    },
    "22-23": {
      date: "04-02-2024",
      hour: "22-23",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 125.48,
      units: "€/MWh",
    },
    "23-24": {
      date: "04-02-2024",
      hour: "23-24",
      "is-cheap": false,
      "is-under-avg": false,
      market: "PVPC",
      price: 117.05,
      units: "€/MWh",
    },
  };

  const arrayzedData = Object.keys(data).map((key) => data[key as keyof Data]);

  const maxPrice = Math.max(...arrayzedData.map((hour) => hour.price));
  const minPrice = Math.min(...arrayzedData.map((hour) => hour.price));

  const avgPrice = Math.round(
    arrayzedData.reduce((acc, hour) => acc + hour.price, 0) /
      arrayzedData.length
  );
  return (
    <main className="flex min-h-screen flex-col gap-6 items-center justify-between p-6 text-center">
      <header className="flex flex-col gap-3 justify-center items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-800">
          Precio de la luz {arrayzedData[0].date}
        </h1>
        <ul className="flex gap-2 flex-wrap items-center justify-center">
          <li className="bg-yellow-100 rounded-full px-3 py-1 w-fit flex gap-1">
            <span className="hidden sm:flex">Precio</span>
            Mínimo: {minPrice}€
          </li>
          <li className="bg-orange-100 rounded-full px-3 py-1 w-fit flex gap-1">
            <span className="hidden sm:flex">Precio</span>
            Medio: {avgPrice}€
          </li>
          <li className="bg-red-100 rounded-full px-3 py-1 w-fit flex gap-1">
            <span className="hidden sm:flex">Precio</span>
            Máximo: {maxPrice}€
          </li>
        </ul>
      </header>

      <ul className="flex flex-col w-full gap-1">
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
