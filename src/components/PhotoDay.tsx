import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "dnri8JUIdkbbAU3HBcBE8HuW8TbfoVufudqeHwQU";

interface ApodData {
  title: string;
  url: string;
  media_type: string;
  explanation: string;
  date: string;
}

const ApodComponent = () => {
  const [apodData, setApodData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
      .then((response) => {
        setApodData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error while loading data.");
        setLoading(false);
        console.error("APOD API error:", err);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center py-12 text-xl text-white bg-gray-900">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-12 text-xl text-red-500 bg-gray-900">
        {error}
      </div>
    );
  if (!apodData) return null;

  if (apodData.media_type === "image") {
    return (
      <header
        className="relative min-h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${apodData.url})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 px-4 py-8 max-h-full overflow-y-auto">
          <h1 className="text-white text-3xl md:text-6xl font-bold mb-4">
            {apodData.title}
          </h1>
          <p className="text-white text-base md:text-xl max-w-2xl mx-auto">
            {apodData.explanation}
          </p>
          <p className="text-white mt-4 text-xs md:text-base">
            {apodData.date}
          </p>
        </div>
      </header>
    );
  } else {
    return (
      <header className="relative min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-4xl px-4 py-8">
          <iframe
            title="apod-video"
            src={apodData.url}
            frameBorder="0"
            allow="encrypted-media"
            allowFullScreen
            className="w-full h-64 md:h-96 rounded-lg shadow-lg"
          ></iframe>
          <div className="mt-6 text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold">{apodData.title}</h1>
            <p className="mt-4 text-base md:text-xl">{apodData.explanation}</p>
            <p className="mt-4 text-xs md:text-base">{apodData.date}</p>
          </div>
        </div>
      </header>
    );
  }
};

export default ApodComponent;
