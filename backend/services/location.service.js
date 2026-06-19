const axios = require("axios");
const LocationCache = require("../models/LocationCache");

async function getCoords(locationName, country = "Polska") {
  if (!locationName || locationName === "Польща") return null;
  const cleanCity = locationName.split(',')[0].split('(')[0].trim();
  const query = `${cleanCity}, ${country}`;
  try {
    const cached = await LocationCache.findOne({ query: query.toLowerCase() });
    if (cached) return { lat: cached.lat, lng: cached.lng };
    
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: query, format: "json", limit: 1, "accept-language": "pl,en" },
      headers: { "User-Agent": "JobVacancyCRM/1.0" }
    });
    if (response.data?.length > 0) {
      const coords = { lat: parseFloat(response.data[0].lat), lng: parseFloat(response.data[0].lon) };
      await LocationCache.create({ query: query.toLowerCase(), ...coords, displayName: response.data[0].display_name });
      return coords;
    }
    return null;
  } catch (err) { return null; }
}
module.exports = { getCoords };