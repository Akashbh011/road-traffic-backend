import axios from "axios";

export const getNearbyplacedata = async (req, res) => {
    console.log("This is the Google Maps API key backend!");
    const { location, radius, keyword } = req.body.params;
    const keywords = keyword.split(" ");
    console.log("keywords are -", keywords);
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
   

    try {
        let combinedResults = [];

        // Loop through each keyword and fetch nearby places with pagination
        for (let word of keywords) {
            let nextPageToken = null;
            
            do {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
                    {
                        params: {
                            location,
                            radius,
                            keyword: word,
                            key: apiKey,
                            pagetoken: nextPageToken,
                        },
                    }
                );

                // Add new results while filtering out duplicates
                combinedResults = [
                    ...combinedResults,
                    ...response.data.results.filter(
                        place => !combinedResults.some(existing => existing.place_id === place.place_id)
                    ),
                ];

                // Update nextPageToken for pagination; if no more pages, set it to null
                nextPageToken = response.data.next_page_token || null;

                // Wait for 2 seconds if there's a next page token (Google API requirement)
                if (nextPageToken) {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            } while (nextPageToken);
        }

        res.json({ results: combinedResults });
    } catch (error) {
        console.error("Error fetching data from Google API:", error);
        res.status(500).json({ error: 'Error fetching data from Google API' });
    }
};


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
