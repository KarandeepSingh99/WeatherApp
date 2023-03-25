import React from "react";

import loader from "../images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import FavoriteLocations from "./Favorite";
import Forecast from "./Forecast";
const dateBuilder = (d) => {
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
};
const defaults = {
    color: "white",
    size: 112,
    animate: true,
};
class Weather extends React.Component {
    state = {
        lat: undefined,
        lon: undefined,
        errorMessage: undefined,
        temperatureC: undefined,
        temperatureF: undefined,
        city: undefined,
        country: undefined,
        humidity: undefined,
        description: undefined,
        icon: "CLEAR_DAY",
        sunrise: undefined,
        sunset: undefined,
        errorMsg: undefined,
        favoriteLocations: JSON.parse(
            localStorage.getItem("favoriteLocations")
        ) || [],
        currentLocation: {}

    };

    setFavoriteLocations = (favoriteLocations) => {
        this.setState({ favoriteLocations });
        localStorage.setItem(
            "favoriteLocations",
            JSON.stringify(favoriteLocations)
        );
    };


    componentDidMount() {
        if (navigator.geolocation) {
            this.getPosition()
                //If user allow location service then will fetch data & send it to get-weather function.
                .then((position) => {
                    this.getWeather(position.coords.latitude, position.coords.longitude);
                })
                .catch((err) => {
                    //If user denied location service then standard location weather will le shown on basis of latitude & latitude.
                    this.getWeather(28.67, 77.22);
                    alert(
                        "Please allow location to get weather"
                    );
                });
        } else {
            alert("Location not available");
        }

        this.timerID = setInterval(
            () => this.getWeather(this.state.lat, this.state.lon),
            600000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }


    getPosition = (options) => {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    };
    getWeather = async (lat, lon) => {
        const api_call = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=ca485c15b7ed2fa5e17dbd034ac1dbef`
        );
        const data = await api_call.json();
        this.setState({
            lat: lat,
            lon: lon,
            city: data.name,
            temperatureC: Math.round(data.main.temp),
            temperatureF: Math.round(data.main.temp * 1.8 + 32),
            humidity: data.main.humidity,
            main: data.weather[0].main,
            country: data.sys.country,

        });
        switch (this.state.main) {
            case "Haze":
                this.setState({ icon: "CLEAR_DAY" });
                break;
            case "Clouds":
                this.setState({ icon: "CLOUDY" });
                break;
            case "Rain":
                this.setState({ icon: "RAIN" });
                break;
            case "Snow":
                this.setState({ icon: "SNOW" });
                break;
            case "Dust":
                this.setState({ icon: "WIND" });
                break;
            case "Drizzle":
                this.setState({ icon: "SLEET" });
                break;
            case "Fog":
                this.setState({ icon: "FOG" });
                break;
            case "Smoke":
                this.setState({ icon: "FOG" });
                break;
            case "Tornado":
                this.setState({ icon: "WIND" });
                break;
            default:
                this.setState({ icon: "CLEAR_DAY" });
        }
    };

    render() {
        if (this.state.temperatureC) {
            return (
                <React.Fragment>

                    <div className="city">
                        <div className="title">
                            <h4>Your Current Location is</h4>   <h2>{this.state.city}</h2>
                            <h3>{this.state.country}</h3>
                        </div>
                        <div className="mb-icon">
                            {" "}
                            <ReactAnimatedWeather
                                icon={this.state.icon}
                                color={defaults.color}
                                size={defaults.size}
                                animate={defaults.animate}
                            />
                            <p>{this.state.main}</p>
                        </div>

                        <div className="favoritelocations">
                            {/* <h2 className="favorite">Favorite Locations</h2> */}
                            <FavoriteLocations
                                favoriteLocations={this.state.favoriteLocations}
                                setFavoriteLocations={this.setFavoriteLocations}
                            />

                            <div className="current-date">{dateBuilder(new Date())}</div>
                            <div className="temperature">

                                <p>
                                    {this.state.temperatureC}°<span>C</span>
                                </p>

                            </div>
                        </div>
                    </div>

                    <Forecast icon={this.state.icon} weather={this.state.main} />
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
                    <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
                        Detecting your location.Please wait....
                    </h3>
                    <h3 style={{ color: "white", marginTop: "10px" }}>
                        Your current location wil be displayed<br></br> & used
                        for calculating weather.
                    </h3>
                </React.Fragment>
            );
        }
    }
}

export default Weather;




