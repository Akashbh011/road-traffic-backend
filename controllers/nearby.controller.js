import axios from "axios";

const calculateDistance = (coord1, coord2) => {
  const R = 6371e3; // Earth radius in meters
  const rad = (degrees) => (degrees * Math.PI) / 180;

  const dLat = rad(coord2.lat - coord1.lat);
  const dLng = rad(coord2.lng - coord1.lng);
  const a = 
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(coord1.lat)) * Math.cos(rad(coord2.lat)) * 
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const filterInstitutionsByRoute = (institutions, routePoint) => {
  return institutions.filter((institution) =>
    calculateDistance(routePoint, {
      lat: institution.geometry.location.lat,
      lng: institution.geometry.location.lng,
    }) <= 50
  );
};

export const getNearbyPlaceData = async (req, res) => {
  const { routePoints, keyword } = req.body.params;
  const keywords = keyword.split(" ");
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const radius = 50; // Set radius for Google API request

  try {
    let combinedResults = [];

    for (let i = 0; i < routePoints.length; i += 3) {
      const point = routePoints[i];

      for (let word of keywords) {
        let nextPageToken = null;

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
          console.log(response);
          // Filter institutions by the current route point within 50m distance
          const nearbyInstitutions = filterInstitutionsByRoute(response.data.results, point);
          combinedResults = [
            ...combinedResults,
            ...nearbyInstitutions.filter(
              (place) => !combinedResults.some((existing) => existing.place_id === place.place_id)
            ),
          ];

          nextPageToken = response.data.next_page_token || null;
          if (nextPageToken) await new Promise((resolve) => setTimeout(resolve, 2000));
        } while (nextPageToken);
      }
    }

    res.json({ results: combinedResults });
  } catch (error) {
    console.error("Error fetching data from Google API:", error);
    res.status(500).json({ error: 'Error fetching data from Google API' });
  }
};


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
