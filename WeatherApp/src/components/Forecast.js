import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast(props) {
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [weather, setWeather] = useState({});
    const [cityList, setCityList] = useState([]);

    const search = (city) => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=ca485c15b7ed2fa5e17dbd034ac1dbef`
            )
            .then((response) => {
                setWeather(response.data);
                setQuery("");
                if (!cityList.includes(response.data.name)) {
                    setCityList([...cityList, response.data.name]);
                }
            })
            .catch(function (error) {
                console.log(error);
                setWeather("");
                setQuery("");
                setError({ message: "Not Found", query: query });
            });
    };

    const defaults = {
        color: "white",
        size: 112,
        animate: true,
    };

    useEffect(() => {
        search("Delhi");
    }, []);

    return (
        <div className="forecast">
            <div className="forecast-icon">
                <ReactAnimatedWeather
                    icon={props.icon}
                    color={defaults.color}
                    size={defaults.size}
                    animate={defaults.animate}
                />
            </div>
            <div className="today-weather">
                <h3>{props.weather}</h3>
                <div className="search-box">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search by city,state,country"
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                    <div className="img-box">
                        <img
                            src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
                            onClick={() => search(query)}
                        />
                    </div>
                </div>
                <ul>
                    {typeof weather.main !== "undefined" && (
                        <div>
                            <li className="cityHead">
                                <p>
                                    {weather.name}, {weather.sys.country}
                                </p>
                                <img
                                    className="temp"
                                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                                />
                                <span className="temp">{Math.round(weather.main.temp)}°C</span>
                            </li>
                        </div>
                    )}
                    <div className="tableCities">
                        {cityList.map((city) => (
                            <li key={city}>
                                <button className="cityButton" onClick={() => search(city)}>
                                    {city}
                                </button>
                            </li>
                        ))}
                    </div>
                    {error.query && (
                        <li>
                            {error.query} {error.message}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Forecast;

