const API_KEY = process.env.GOOGLE_GEOCODING_API;
const axios = require("axios");
const HttpError = require("../models/http_error");

async function getCords(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for this address",
      422
    );
    throw error;
  }

  const cord = data?.results[0]?.geometry?.location;

  return cord;
}

exports.getCords = getCords;
