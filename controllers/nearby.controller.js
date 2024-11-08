import axios from "axios";
// const Location = require('./models/nearbyHotspot.model.js'); 
import { hotspotLocation } from '../models/nearbyHotspot.model.js'  // Assuming model file is in models folder
//-----------------------------
// nearby hotspots feature : 

export const findNearbyLocations = async (req, res) => {
  const { latitude, longitude } = req.body; // Retrieve latitude and longitude from request body
  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required." });
  }

  try {
    // Fetch all locations (if needed)
    // const allLocations = await hotspotLocation.find({});
    // console.log("All locations:", allLocations);

    // Check if a specific location exists near the provided latitude and longitude
    const existingLocation = await hotspotLocation.findOne({ lat: latitude, lng: longitude });

    // console.log("letss gooo !!");

    if (existingLocation) {
      return res.json({
        message: "NEARBY TRAFFIC CONGESTION HOTSPOT DETECTED!",
        info: "Maybe under construction as per MISSION-15",
        location: existingLocation.location,
        lat: existingLocation.lat,
        lng: existingLocation.lng
      });
    } else {
      res.status(404).json({ message: "No nearby location found." });
    }
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const findNearbyHotspots = async (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required." });
  }

  const RADIUS = 6371e3; // Earth radius in meters

  // Helper function to calculate the distance between two points using the Haversine formula
  const computeHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RADIUS * c; // Distance in meters
  };

  try {
    // Step 1: Find and remove duplicates based on latitude and longitude
    // const duplicates = await hotspotLocation.aggregate([
    //   {
    //     $group: {
    //       _id: { lat: "$lat", lng: "$lng" }, // Group by latitude and longitude
    //       uniqueIds: { $addToSet: "$_id" },   // Collect all IDs of duplicate records
    //       count: { $sum: 1 }                  // Count duplicates
    //     }
    //   },
    //   {
    //     $match: {
    //       count: { $gt: 1 }                   // Filter groups with more than one entry (duplicates)
    //     }
    //   }
    // ]);

    // // Step 2: Delete duplicates, keeping only one entry
    // for (const record of duplicates) {
    //   const [keepId, ...removeIds] = record.uniqueIds; // Keep the first ID, remove the rest
    //   await hotspotLocation.deleteMany({ _id: { $in: removeIds } });
    // }

    // Fetch all locations after removing duplicates
    const allLocations = await hotspotLocation.find({});

    // Filter locations within 50 meters
    const nearbyHotspots = allLocations.filter((location) => {
      const distance = computeHaversineDistance(latitude, longitude, location.lat, location.lng);
      return distance <= 50000;
    });

    if (nearbyHotspots.length > 0) {
      return res.json({
        message: "Nearby traffic congestion hotspots detected!",
        info: "Maybe under construction as per MISSION-15",
        locations: nearbyHotspots
      });
    } else {
      res.status(404).json({ message: "No nearby location found within 50 meters." });
    }
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Internal server error." });
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
  const thirtyMinutes = 30 * 60 * 1000;
  
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
};



//v2

// import axios from "axios";

// const calculateDistance = (coord1, coord2) => {
//   const R = 6371e3; // Earth radius in meters
//   const rad = (degrees) => (degrees * Math.PI) / 180;
//   const dLat = rad(coord2.lat - coord1.lat);
//   const dLng = rad(coord2.lng - coord1.lng);
//   const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(coord1.lat)) * Math.cos(rad(coord2.lat)) * Math.sin(dLng / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in meters
// };

// // Check if place is about to open or close within a 30-minute interval
// const isPlaceRelevant = (openingHours) => {
//   if (!openingHours || !openingHours.periods) return false; // Return if no opening hours are available

//   const now = new Date();
//   const thirtyMinutesInMillis = 30 * 60 * 1000;

//   // Find today's opening hours period (if available)
//   const todayOpeningHours = openingHours.periods.find(
//     (period) => period.open && period.close
//   );

//   if (!todayOpeningHours) return false; // Return if no open/close info is available for today

//   const openingTime = new Date(todayOpeningHours.open.time);
//   const closingTime = new Date(todayOpeningHours.close.time);

//   return (
//     (closingTime - now > 0 && closingTime - now <= thirtyMinutesInMillis) || // About to close in 30 mins
//     (now - closingTime >= 0 && now - closingTime <= thirtyMinutesInMillis) || // Closed less than 30 mins ago
//     (openingTime - now > 0 && openingTime - now <= thirtyMinutesInMillis) // About to open in 30 mins
//   );
// };


// export const getNearbyPlaceData = async (req, res) => {
//   const { routePoints, keyword } = req.body.params;
//   const keywords = keyword.split(" ");
//   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//   const radius = 100; // Adjusted radius
//   const pointBatchSize = 7;

//   const filteredPoints = routePoints.filter((_, index) => index % pointBatchSize === 0);
  
//   try {
//     let combinedResults = [];
//     const apiRequests = filteredPoints.flatMap((point) =>
//       keywords.map(async (word) => {
//         let nextPageToken = null;
//         let wordResults = [];

//         do {
//           const response = await axios.get(
//             `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
//             {
//               params: {
//                 location: `${point.lat},${point.lng}`,
//                 radius,
//                 keyword: word,
//                 key: apiKey,
//                 pagetoken: nextPageToken,
//               },
//             }
//           );

//           const places = response.data.results;
//           nextPageToken = response.data.next_page_token || null;

//           // For each place, make a place details request to get the opening hours
//           const placeDetailsRequests = places.map(async (place) => {
//             const detailsResponse = await axios.get(
//               `https://maps.googleapis.com/maps/api/place/details/json`,
//               {
//                 params: {
//                   place_id: place.place_id,
//                   fields: "opening_hours",
//                   key: apiKey,
//                 },
//               }
//             );

//             const openingHours = detailsResponse.data.result.opening_hours;
//             return isPlaceRelevant(openingHours) ? place : null; // Only return if relevant
//           });

//           // Await all details requests
//           const relevantPlaces = (await Promise.all(placeDetailsRequests)).filter(Boolean);
//           wordResults.push(...relevantPlaces);

//           // Avoid adding duplicate places
//           wordResults = wordResults.filter(
//             (place, index, self) =>
//               index === self.findIndex((p) => p.place_id === place.place_id)
//           );
//         } while (nextPageToken);

//         return wordResults;
//       })
//     );

//     // Await all keyword/place requests
//     const results = await Promise.all(apiRequests);
//     combinedResults = results.flat();

//     res.json({ results: combinedResults });
//   } catch (error) {
//     console.error("Error fetching data from Google API:", error);
//     res.status(500).json({ error: "Error fetching data from Google API" });
//   }
// };


//v1

// // import axios from "axios";

// // export const getNearbyplacedata = async (req, res) => {
// //     console.log("This is the Google Maps API key backend!");
// //     const { location, radius, keyword } = req.body.params;
// //     const keywords = keyword.split(" ");
// //     const apiKey = 'AIzaSyAs6xHZ_UEGk5IFF2V620vsgnMOoOrqepY';

// //     // Get the current time in hours and minutes, and the current day of the week
// //     const currentDate = new Date();
// //     const currentDay = currentDate.getDay(); // Day of the week (0 = Sunday, 1 = Monday, etc.)
// //     const currentTime = `${currentDate.getHours()}${currentDate.getMinutes().toString().padStart(2, '0')}`; // Format as HHMM

// //     try {
// //         let combinedResults = [];

// //         // Step 1: Loop through each keyword and fetch places
// //         for (let word of keywords) {
// //             const response = await axios.get(
// //                 `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
// //                 {
// //                     params: {
// //                         location,
// //                         radius,
// //                         keyword: word,
// //                         key: apiKey,
// //                     },
// //                 }
// //             );

// //             // Step 2: For each place, get additional details using Place Details API
// //             const placesWithDetails = await Promise.all(response.data.results.map(async place => {
// //                 const detailsResponse = await axios.get(
// //                     `https://maps.googleapis.com/maps/api/place/details/json`,
// //                     {
// //                         params: {
// //                             place_id: place.place_id,
// //                             fields: "name,opening_hours",
// //                             key: apiKey,
// //                         },
// //                     }
// //                 );

// //                 // Check if opening_hours exists and filter based on time
// //                 const openingHours = detailsResponse.data.result.opening_hours;
// //                 if (openingHours) {
// //                     const isWithinTimeRange = openingHours.periods.some(period => {
// //                         const openTime = parseInt(period.open.time, 10);
// //                         const closeTime = parseInt(period.close.time, 10);

// //                         // Convert currentTime to an integer for comparison
// //                         const currentTimeInt = parseInt(currentTime, 10);

// //                         // Check if the current time is within 30 minutes before or after the open/close times
// //                         const isOpenInRange = openTime >= (currentTimeInt - 300) && openTime <= (currentTimeInt + 300);
// //                         const isCloseInRange = closeTime >= (currentTimeInt - 300) && closeTime <= (currentTimeInt + 300);

// //                         return (period.open.day === currentDay && isOpenInRange) || (period.close?.day === currentDay && isCloseInRange);
// //                     });

// //                     // Only include the place if it has open/close times in the range
// //                     if (isWithinTimeRange) {
// //                         return {
// //                             ...place,
// //                             opening_hours: openingHours,
// //                         };
// //                     }
// //                 }

// //                 // Return null if the place is not within the time range
// //                 return null;
// //             }));

// //             // Filter out any null results and merge results without duplicates
// //             combinedResults = [
// //                 ...combinedResults,
// //                 ...placesWithDetails.filter(
// //                     place => place && !combinedResults.some(existing => existing.place_id === place.place_id)
// //                 ),
// //             ];
// //         }

// //         res.json({ results: combinedResults });
// //     } catch (error) {
// //         console.error("Error fetching data from Google API:", error);
// //         res.status(500).json({ error: 'Error fetching data from Google API' });
// //     }
// // };
