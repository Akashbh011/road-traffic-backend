import axios from "axios";

import { hotspotLocation } from '../models/nearbyHotspot.model.js'  

export const getNearbySpots = async (req, res) => {
  const { routePoints } = req.body.params;
  const radius = 1000; 
  const pointBatchSize = 7; 

  try {

    const filteredPoints = routePoints.filter((_, index) => index % pointBatchSize === 0);
    let nearbySpots = [];

    const hotspots = await hotspotLocation.find({});

    for (let point of filteredPoints) {
      const nearbyLocations = hotspots.filter(spot => {
        const distance = calculateDistance(point, { lat: spot.lat, lng: spot.lng });
        return distance <= radius;
      });


      nearbySpots = [...nearbySpots, ...nearbyLocations];
    }

    const uniqueNearbySpots = Array.from(new Set(nearbySpots.map(spot => spot.location)))
      .map(locationName => nearbySpots.find(spot => spot.location === locationName));
    res.json({ results: uniqueNearbySpots });
  } catch (error) {
    console.error("Error fetching nearby traffic spots:", error);
    res.status(500).json({ error: "Error fetching nearby traffic spots" });
  }
};



const calculateDistance = (coord1, coord2) => {
  const R = 6371e3; // Earth radius in meters
  const rad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = rad(coord2.lat - coord1.lat);
  const dLng = rad(coord2.lng - coord1.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(coord1.lat)) * Math.cos(rad(coord2.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

const parseTimeString = (timeStr) => {
  const hours = parseInt(timeStr.substring(0, 2));
  const minutes = parseInt(timeStr.substring(2));
  const now = new Date();
  const time = new Date(now);
  time.setHours(hours, minutes, 0, 0);
  return time;
};

// Handles cases including midnight crossover
const isPlaceRelevant = (openingHours) => {
  if (!openingHours?.periods) return false;

  const now = new Date();
  const thirtyMinutes = 360 * 60 * 1000;
  
  // Find the current period
  const today = now.getDay();
  const currentPeriod = openingHours.periods.find(period => {
    const openDay = period.open?.day;
    const closeDay = period.close?.day;
    
    // Handle cases where the place is open across midnight
    if (openDay !== undefined && closeDay !== undefined) {
      if (openDay === closeDay) {
        return openDay === today;
      } else {
        // Handle overnight periods
        return today === openDay || today === closeDay;
      }
    }
    return false;
  });

  if (!currentPeriod?.open || !currentPeriod?.close) return false;

  const openTime = parseTimeString(currentPeriod.open.time);
  const closeTime = parseTimeString(currentPeriod.close.time);
  
  // Handle overnight periods
  if (currentPeriod.open.day !== currentPeriod.close.day) {
    if (closeTime < openTime) {
      closeTime.setDate(closeTime.getDate() + 1);
    }
  }

  // Check if:
  // 1. About to open (within next 30 mins)
  const aboutToOpen = openTime > now && openTime - now <= thirtyMinutes;
  
  // 2. About to close (within next 30 mins)
  const aboutToClose = closeTime > now && closeTime - now <= thirtyMinutes;
  
  // 3. Recently closed (within last 30 mins)
  const recentlyClosed = now > closeTime && now - closeTime <= thirtyMinutes;

  return aboutToOpen || aboutToClose || recentlyClosed;
};


export const getNearbyPlaceData = async (req, res) => {
  const { routePoints, keyword } = req.body.params;
  const keywords = keyword.split(" ");
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const radius = 100; // 100 meters radius
  const pointBatchSize = 7;

  const filteredPoints = routePoints.filter((_, index) => index % pointBatchSize === 0);

  try {
    let combinedResults = [];
    const seenPlaceIds = new Set();

    const apiRequests = filteredPoints.flatMap((point) =>
      keywords.map(async (word) => {
        let nextPageToken = null;
        let wordResults = [];

        do {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
            {
              params: {
                location: `${point.lat},${point.lng}`,
                radius,
                keyword: word,
                type: "school|university", // Add specific types
                key: apiKey,
                pagetoken: nextPageToken,
              },
            }
          );

          // Handle rate limiting
          if (nextPageToken) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before using nextPageToken
          }

          const places = response.data.results;
          nextPageToken = response.data.next_page_token || null;

          // Filter places by distance and additional checks
          const placesInRange = places.filter(place =>
            calculateDistance(
              { lat: point.lat, lng: point.lng },
              { lat: place.geometry.location.lat, lng: place.geometry.location.lng }
            ) <= radius &&
            (place.types.includes("school") || place.types.includes("university")) // Ensure type matches
          );

          // Get details only for places in range
          const placeDetailsRequests = placesInRange.map(async (place) => {
            if (seenPlaceIds.has(place.place_id)) return null;

            try {
              const detailsResponse = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json`,
                {
                  params: {
                    place_id: place.place_id,
                    fields: "opening_hours,name,types", // Fetch name and types for further validation
                    key: apiKey,
                  },
                }
              );

              const { opening_hours: openingHours, types, name } = detailsResponse.data.result;

              // Validate place relevance
              if (
                isPlaceRelevant(openingHours) &&
                (types.includes("school") || types.includes("university") || name.match(/school|college|university/i))
              ) {
                seenPlaceIds.add(place.place_id);
                return place;
              }
            } catch (error) {
              console.error(`Error fetching details for place ${place.place_id}:`, error);
            }
            return null;
          });

          const relevantPlaces = (await Promise.all(placeDetailsRequests)).filter(Boolean);
          wordResults.push(...relevantPlaces);
        } while (nextPageToken);

        return wordResults;
      })
    );

    const results = await Promise.all(apiRequests);
    combinedResults = results.flat();

    res.json({ results: combinedResults });
  } catch (error) {
    console.error("Error fetching data from Google API:", error);
    res.status(500).json({ error: "Error fetching data from Google API" });
  }
};



//recent version
/*export const getNearbyPlaceData = async (req, res) => {
  const { routePoints, keyword } = req.body.params;
  const keywords = keyword.split(" ");
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const radius = 100; // 100 meters radius
  const pointBatchSize = 7;

  const filteredPoints = routePoints.filter((_, index) => index % pointBatchSize === 0);
  
  try {
    let combinedResults = [];
    const seenPlaceIds = new Set();

    const apiRequests = filteredPoints.flatMap((point) =>
      keywords.map(async (word) => {
        let nextPageToken = null;
        let wordResults = [];

        do {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
            {
              params: {
                location: `${point.lat},${point.lng}`,
                radius,
                keyword: word,
                key: apiKey,
                pagetoken: nextPageToken,
              },
            }
          );

          // Handle rate limiting
          if (nextPageToken) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before using nextPageToken
          }

          const places = response.data.results;
          nextPageToken = response.data.next_page_token || null;

          // Filter places by distance first
          const placesInRange = places.filter(place => 
            calculateDistance(
              { lat: point.lat, lng: point.lng },
              { lat: place.geometry.location.lat, lng: place.geometry.location.lng }
            ) <= radius
          );

          // Get details only for places in range
          const placeDetailsRequests = placesInRange.map(async (place) => {
            if (seenPlaceIds.has(place.place_id)) return null;
            
            try {
              const detailsResponse = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json`,
                {
                  params: {
                    place_id: place.place_id,
                    fields: "opening_hours",
                    key: apiKey,
                  },
                }
              );

              const openingHours = detailsResponse.data.result.opening_hours;
              if (isPlaceRelevant(openingHours)) {
                seenPlaceIds.add(place.place_id);
                return place;
              }
            } catch (error) {
              console.error(`Error fetching details for place ${place.place_id}:`, error);
            }
            return null;
          });

          const relevantPlaces = (await Promise.all(placeDetailsRequests)).filter(Boolean);
          wordResults.push(...relevantPlaces);
        } while (nextPageToken);

        return wordResults;
      })
    );

    const results = await Promise.all(apiRequests);
    combinedResults = results.flat();

    res.json({ results: combinedResults });
  } catch (error) {
    console.error("Error fetching data from Google API:", error);
    res.status(500).json({ error: "Error fetching data from Google API" });
  }
};*/

