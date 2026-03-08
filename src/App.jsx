import { useEffect, useState } from "react";

export default function App() {
  const [city, setCity] = useState("Warszawa");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [currentBg, setCurrentBg] = useState("/imgs/bezchmurnie.jpg");
  const [nextBg, setNextBg] = useState(null);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    const key = import.meta.env.VITE_OPENWEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${key}&units=metric&lang=pl`;

    setErr("");
    setData(null);

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setData)
      .catch(() => setErr("Nie udało się pobrać pogody"));
  }, [city]);

  function formatCityTime(unixTime, timezoneOffset) {
    const date = new Date((unixTime + timezoneOffset) * 1000);
    return date.toUTCString().slice(17, 22);
  }

  useEffect(() => {
    if (!data) return;

    const weatherMain = data.weather?.[0]?.main || "Default";
    const backgrounds = {
      Clear: "/imgs/bezchmurnie.jpg",
      Clouds: "/imgs/pochmurno.jpg",
      Rain: "/imgs/deszcz.jpg",
      Snow: "/imgs/snieg.jpg",
      Thunderstorm: "/imgs/burza.jpg",
      Drizzle: "/imgs/mzwaka.jpg",
      Mist: "/imgs/mgla.jpg",
      Fog: "/imgs/mgla.jpg",
      Haze: "/imgs/mgla.jpg",
      Default: "/imgs/bezchmurnie.jpg",
    };

    const newBg = backgrounds[weatherMain] || backgrounds.Default;

    if (newBg !== currentBg) {
      setNextBg(newBg);
    }
  }, [data, currentBg]);

  return (
    <div className="app">
      <img className="bg" src={currentBg} alt="" />

      {nextBg && (
        <img
          className={`bg-next ${showNext ? "show" : ""}`}
          src={nextBg}
          alt=""
          onLoad={() => {
            requestAnimationFrame(() => setShowNext(true));
            setTimeout(() => {
              setCurrentBg(nextBg);
              setNextBg(null);
              setShowNext(false);
            }, 600);
          }}
        />
      )}

      <nav>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button className="cityList" onClick={() => setCity("Warszawa")}>Warszawa</button>
          <button className="cityList" onClick={() => setCity("Berlin")}>Berlin</button>
          <button className="cityList" onClick={() => setCity("Paryż")}>Paryż</button>
          <button className="cityList" onClick={() => setCity("Londyn")}>Londyn</button>
          <button className="cityList" onClick={() => setCity("Rzym")}>Rzym</button>
          <button className="cityList" onClick={() => setCity("Madryt")}>Madryt</button>
          <label htmlFor="miasto">Wyszukaj</label>
          <input
            id="miasto"
            name="miasto"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </nav>

      <div style={{ padding: 16 }}>
        {err && <p style={{ color: "crimson" }}>{err}</p>}

        {data && (
          <div>
            <h1 id="cityName">{data.name}</h1>
            <p id="temp">{Math.round(data.main.temp)}°</p>
            <p id="weather">{data.weather?.[0]?.description}</p>
            <p id="temps">
              H: {Math.round(data.main.temp_max)}° L: {Math.round(data.main.temp_min)}°
            </p>

            <div id="additionalInfo">
              <div id="row1">
                <p>Temperatura odczuwalna {Math.round(data.main.feels_like)}°</p>
                <p>Ciśnienie {data.main.pressure} hPa</p>
                <p>Wilgotność {data.main.humidity}%</p>
              </div>
              <div id="row2">
                <p>Prędkość wiatru {Math.round(data.wind.speed)} m/s</p>
                <p>Wschód słońca {formatCityTime(data.sys.sunrise, data.timezone)}</p>
                <p>Zachód słońca {formatCityTime(data.sys.sunset, data.timezone)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
