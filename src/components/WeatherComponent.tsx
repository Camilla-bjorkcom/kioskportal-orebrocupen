import React, { useEffect, useState } from "react";

interface WeatherComponentProps {
  lat: number;
  lon: number;
}

const WeatherComponent: React.FC<WeatherComponentProps> = ({ lat, lon }) => {
  interface WeatherData {
    properties: {
      timeseries: {
        data: {
          instant: {
            details: {
              air_temperature: number;
            };
          };
          next_1_hours: {
            summary: {
              symbol_code: string;
            };
            details: {
              precipitation_amount: number;
            };
          };
        };
      }[];
    };
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
        {
          headers: {
            "User-Agent": "MyWeatherApp/1.0 (youremail@example.com)",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP-fel! Status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [lat, lon]);

  if (loading) return <p>Hämtar väderdata...</p>;
  if (error) return <p>Fel: {error}</p>;

  // Hämta relevant data
  const temperature =
    weatherData?.properties?.timeseries[0]?.data?.instant?.details
      ?.air_temperature;
  const weatherSymbol: keyof typeof weatherDescriptions =
    (weatherData?.properties?.timeseries[0]?.data?.next_1_hours?.summary
      ?.symbol_code as keyof typeof weatherDescriptions) || "clearsky";
  const precipitation =
    weatherData?.properties?.timeseries[0]?.data?.next_1_hours?.details
      ?.precipitation_amount;

  // Översättning av symbol_code till text
  const weatherDescriptions = {
    clearsky: "Soligt",
    cloudy: "Molnigt",
    rain: "Regn",
    snow: "Snö",
    partlycloudy: "Delvis molnigt",
    fog: "Dimma",
  };

  const weatherText = weatherDescriptions[weatherSymbol] || "Okänt väder";

  return (
    <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Dagens väderprognos
      </h3>
      <p className="text-gray-600">
        Temperatur: <span className="font-medium">{temperature} °C</span>
      </p>
      <p className="text-gray-600">
        Väder: <span className="font-medium">{weatherText}</span>
      </p>
      <p className="text-gray-600">
        Nederbörd: <span className="font-medium">{precipitation} mm</span>
      </p>
      <p className="text-gray-500 text-sm mt-4">
        Latitud: {lat}, Longitud: {lon}
      </p>
    </div>
  );
};

export default WeatherComponent;
