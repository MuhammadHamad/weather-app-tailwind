import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IoMdSunny,
  IoMdRainy,
  IoMdCloudy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
} from "react-icons/io";
import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
  BsThermometerHalf,
} from "react-icons/bs";
import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

const APIkey = "fb85c1df147fc8e5797de16d2ba7355e";

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("London");
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputValue !== "") {
      // set location
      setLocation(inputValue);
    }

    // if input is empty
    if (inputValue === "") {
      // set animate to true
      setAnimate(true);

      // after 500 ms, set animate to false
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }

    // select input
    const input = document.querySelector("input");
    input.value = "";
  };

  // fetching the weather data
  useEffect(() => {
    // set loading to true
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios
      .get(url)
      .then((res) => {
        setTimeout(() => {
          setData(res.data);
          setLoading(false);
        }, 200);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg(err);
      });
  }, [location]);

  console.log(data);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 1500);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  //! SHOW SPINNER WHEN THERE IS NO DATA
  if (!data) {
    return (
      <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover flex items-center justify-center">
        <div>
          <ImSpinner8 className="text-5xl animate-spin text-white" />
        </div>
      </div>
    );
  }

  //? SET THE ICON ACCORDING TO THE WEATHER
  let icon;
  switch (data.weather[0].main) {
    case "Clouds":
      icon = <IoMdCloudy className="text-gray-300" />;
      break;
    case "Haze":
      icon = <BsCloudHaze2Fill />;
      break;
    case "Rain":
      icon = <IoMdRainy className="text-[#31cafb]" />;
      break;
    case "Clear":
      icon = <IoMdSunny className="text-yellow-400" />;
      break;
    case "Drizzle":
      icon = <BsCloudDrizzleFill className="text-[#31cafb]" />;
      break;
    case "Snow":
      icon = <IoMdSnow className="text-white" />;
      break;
  }

  //? creating a date object
  const date = new Date();

  return (
    <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center p-5 lg:px-0">
      {errorMsg && (
        <div className="w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute z-10 top-2 lg:top-2 p-4 capitalize rounded-md">{`${errorMsg.response.data.message}`}</div>
      )}

      {/* //? ----- FORM ------- */}
      <form
        className={`${
          animate ? "animate-shake" : "animate-none"
        } h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}
      >
        <div className="h-full flex items-center justify-between relative p-2">
          <input
            onChange={handleInput}
            className="flex-1 outline-none bg-transparent text-white placeholder:text-white text-[15px] font-light pl-6 h-full"
            type="text"
            placeholder="Search by city or country"
          />
          <button
            onClick={handleSubmit}
            className="bg-[#1ab8ed] hover:bg-[#15abdd] rounded-full h-full w-20 flex justify-center items-center transition"
          >
            <IoMdSearch className="text-2xl text-white" />
          </button>
        </div>
      </form>

      {/* //? ----- CARD ------- */}
      <div className="bg-black/20 w-full max-w-[450px] min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] pb-12 pt-4 px-6 shadow-2xl shadow-black">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <ImSpinner8 className="animate-spin text-5xl" />
          </div>
        ) : (
          <div>
            {/* //* CARD TOP */}
            <div className="flex items-center gap-x-5">
              {/* icon */}
              <div className="text-[87px]">{icon}</div>
              <div>
                {/* country name */}
                <div className="text-2xl font-semibold">
                  {data.name}, {data.sys.country}
                </div>
                {/* date */}
                <div>
                  {date.getDate()} / {date.getMonth() + 1} /{" "}
                  {date.getFullYear()}
                </div>
              </div>
            </div>

            {/* //* CARD BODY */}
            <div className="my-20">
              <div className="flex items-center justify-center">
                {/* temp */}
                <div className="text-[144px] leading-none font-light">
                  {parseInt(data.main.temp)}
                </div>
                {/* celsius icon */}
                <div className="text-4xl">
                  <TbTemperatureCelsius />
                </div>
              </div>
              {/* weather description */}
              <div className="capitalize text-center">
                {data.weather[0].description}
              </div>
            </div>

            {/* //* CARD BOTTOM */}
            <div className="flex justify-between flex-wrap  max-w-[378px] mx-auto gap-y-6">
              <div className="flex items-center gap-x-2 w-40">
                {/* icon */}
                <div className="text-[20px]">
                  <BsEye />
                </div>
                <div>
                  Visibility
                  <span className="ml-2">{data.visibility / 1000} km</span>
                </div>
              </div>

              <div className="flex items-center gap-x-2 w-40">
                {/* icon */}
                <div className="text-[20px]">
                  <BsThermometer />
                </div>
                <div className="flex">
                  Feels like
                  <span className="ml-2">{parseInt(data.main.feels_like)}</span>
                  <TbTemperatureCelsius />
                </div>
              </div>

              <div className="flex items-center gap-x-2 w-40">
                {/* icon */}
                <div className="text-[20px]">
                  <BsWater />
                </div>
                <div>
                  Humidity
                  <span className="ml-2">{data.main.humidity} %</span>
                </div>
              </div>

              <div className="flex items-center gap-x-2 w-40">
                {/* icon */}
                <div className="text-[20px]">
                  <BsWind />
                </div>
                <div>
                  Wind
                  <span className="ml-2">{data.main.wind} m/s</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
