import PathInfo from '../models/pathinfo.model.js';
import { Diversion } from "../models/diversion.model.js";
import { Construction } from "../models/construction.model.js";

import { hotspotLocation } from '../models/nearbyHotspot.model.js' 
import { Event } from '../models/event.model.js';



export const addPathInfo = async (req, res) => {


  try {
    
    const { pathId, timeRange,score, level } = req.body;
    let date = new Date(req.body.date);
    date = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    console.log(date);
    console.log("score is --",score);
    if (!pathId || !timeRange || !date || score == null || !level) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const formattedDate = new Date(date);
    formattedDate.setHours(0,0,0,0);
    
    const existingEntries = await PathInfo.find({ pathId, timeRange, date: date });
    

    if (existingEntries.length === 0 && score!=0 ) {

      const newPathInfo = new PathInfo({

        pathId,

        timeRange,

        date: date,

        score,

        level,

      });

      await newPathInfo.save();
      

      return res.status(201).json({ message: 'Path info added successfully.', data: newPathInfo });

    } else {

      const totalScore = existingEntries.reduce((sum, entry) => sum + entry.score, 0) + score;

      const newScore = totalScore / (existingEntries.length + 1);

      await PathInfo.updateMany(

        { pathId, timeRange, date: formattedDate },

        { $set: { score: newScore, level } }

      );

      

      return res.status(200).json({

        message: 'Existing path info updated with average score.',

        data: { pathId, timeRange, date: formattedDate, score: newScore, level },

      });

    }

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: 'Server error. Please try again later.' });

  }
};


export const getCalendarData = async (req, res) => {
  try {
    const { pathId, timeRange } = req.query;

    if (!pathId || !timeRange) {
      return res.status(400).json({ message: 'Path ID and Time Range are required.' });
    }

    const data = await PathInfo.find({ pathId, timeRange });

    // Normalize dates to remove time offsets
    const normalizedData = data.map((entry) => ({
      ...entry._doc,
      date: new Date(entry.date).toISOString().split('T')[0], // Return only the date part in ISO format
    }));

    res.status(200).json(normalizedData);
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


export const getFestivalData = async (req, res) => {
  try {
    const { pathId, timeRange, dates } = req.query;

    if (!pathId || !timeRange || !dates) {
      return res.status(400).json({ message: 'Missing required query parameters: pathId, timeRange, or dates' });
    }

    // Parse the dates array from the query (check if it's a valid JSON array string)
    let parsedDates = [];
    try {
      parsedDates = JSON.parse(dates); // parse stringified dates array
    } catch (error) {
      return res.status(400).json({ message: 'Invalid dates array format' });
    }

    // Check if parsedDates is an array and has values
    if (!Array.isArray(parsedDates) || parsedDates.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty dates array' });
    }

    // Normalize the dates by removing the time part (comparing only date portion)
    const normalizedDates = parsedDates.map(date => new Date(date).toISOString().slice(0, 10));  // format as YYYY-MM-DD
    
    // Query the database, ensure that the date field is also in YYYY-MM-DD format (date without time)
    const results = await PathInfo.find({
      pathId,
      timeRange,
    });

    // Process results to compare only the date part (YYYY-MM-DD)
    const response = results.filter(record => {
      const recordDate = new Date(record.date).toISOString().slice(0, 10); // Normalize the date from the database
      return normalizedDates.includes(recordDate);  // Compare only the date part
    }).map(record => ({
      year: new Date(record.date).getFullYear(),
      score: record.score,
    }));

    // Send the processed response
    if (response.length === 0) {
      return res.status(404).json({ message: 'No data found for the provided criteria' });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching festival data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getLastFourWeekDayData = async (req, res) => {
  try {
    const { path, timeRange, day } = req.query;
    

    if (!path || !timeRange || day === undefined) {
      return res.status(400).json({ message: 'Path ID, Time Range, and Day are required.' });
    }

    const selectedDay = parseInt(day); // Convert day to an integer
    

    if (isNaN(selectedDay) || selectedDay < 0 || selectedDay > 6) {
      return res.status(400).json({ message: 'Invalid day value. It must be between 0 (Sunday) and 6 (Saturday).' });
    }

    // Get today's date and set time to midnight
    let today = new Date();
    today = new Date(today.getTime() + (5.5 * 60 * 60 * 1000));

    const data = [];
    let currentDate = new Date(today);
    let weekdaysFound = 0;
    
    // Loop to find the last 4 selected weekdays, excluding today
    while (weekdaysFound < 4) {
      currentDate.setDate(currentDate.getDate() - 1); // Go to the previous day
      
      
      if (currentDate.getDay() === selectedDay) {
        const formattedDate = new Date(currentDate);
        formattedDate.setHours(0, 0, 0, 0);
        console.log(formattedDate);
        
        
        // Fetch data for the current weekday
        const entries = await PathInfo.find({
          pathId:path,
          timeRange,
          date: formattedDate,
        });

        console.log(entries);
        

        if (entries.length > 0) {
          data.push({
            date: formattedDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            score: entries[0].score, // Assuming one record per day, adjust if necessary
          });
        }

        weekdaysFound += 1;
      }
    }

    // Sort data by date (ascending)
    data.sort((a, b) => new Date(a.date) - new Date(b.date));


    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching last four weekday data:', error);
    res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
  }
};

const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth radius in meters
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);
  const deltaLat = toRadians(point2.lat - point1.lat);
  const deltaLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const predictTraffic = async(req,res) => {
  
  let { date, timeSlot, routePoints } = req.query;
  console.log(date);
  
  
       // Ensure date and timeSlot are provided
  if (!date || !timeSlot) {
    return res.status(400).json({ error: "date and timeSlot are required" });
  }
  

  const pointBatchSize = 7;
  let score = 0;
  let constructionCount = 0;
  let diversionCount = 0;
  let eventCount = 0;
  let hotspotCount = 0;

  try {

    const inputDate = new Date(date);
    const dayOfWeek = inputDate.getDay();

    
    const now = new Date();
    
    const eightDaysLater = new Date(now);
    eightDaysLater.setDate(now.getDate() + 8);

    

    if(inputDate < now){
      return res.status(404).json({ error: "Please enter a future date" });
    }
    

    if (inputDate >= now && inputDate <= eightDaysLater) {
      const pastDates = [];
      let currentDate = new Date(inputDate);

      for (let i = 0; i < 8; i++) {
        currentDate.setDate(currentDate.getDate() - 7); // Go back by one week
        pastDates.push(new Date(currentDate));
      }

      // Fetch data from the database for the last 8 dates, matching the time slot
      const records = await PathInfo.find({
        date: { $in: pastDates },
        timeRange: timeSlot,
      });

      if (records.length === 0) {
        return res.status(404).json({ error: "No data found for the given criteria." });
      }

      // Calculate the average score
      const totalScore = records.reduce((sum, record) => sum + record.score, 0);
      const averageScore = totalScore / records.length;

      return res.status(200).json({
        averageScore,
      });
    }



    routePoints = Object.values(routePoints);
    // Filter every 7th entry from routePoints
    const filteredPoints = routePoints.filter((_, index) => index % pointBatchSize === 0);

    const constructions = await Construction.find({});
    const diversions = await Diversion.find({});
    const events = await Event.find({});
    const hotspots = await hotspotLocation.find({});

    for (let point of filteredPoints) {
      // Check constructions
      for (let construction of constructions) {
        const isDateInRange =
          new Date(date) >= new Date(construction.startDate) &&
          new Date(date) <= new Date(construction.expectedEndDate);
        if (isDateInRange) {
          for (let cPoint of construction.constructionPoints) {
            if (calculateDistance(point, cPoint) <= 200) {
              constructionCount++;
              break;
            }
          }
        }
      }


      // Check diversions
      for (let diversion of diversions) {
        const isDateInRange =
          new Date(date) >= new Date(diversion.startDate) &&
          new Date(date) <= new Date(diversion.endDate);
        if (isDateInRange) {
          for (let dPoint of diversion.diversionPoints) {
            if (calculateDistance(point, dPoint) <= 200) {
              diversionCount++;
              break;
            }
          }
        }
      }


      // Check events
      for (let event of events) {
        const isDateInRange =
          new Date(date) >= new Date(event.startTime) &&
          new Date(date) <= new Date(event.endTime);
        if (isDateInRange) {
          for (let ePoint of event.eventPoints) {
            if (calculateDistance(point, ePoint) <= 200) {
              eventCount++;
              break;
            }
          }
        }
      }


      // Check traffic hotspots
      for (let hotspot of hotspots) {
        const hotspotPoint = {
          lat: parseFloat(hotspot.lat),
          lng: parseFloat(hotspot.lng),
        };
        if (calculateDistance(point, hotspotPoint) <= 200) {
          hotspotCount++;
          break;
        }
      }
    }

    score += 10 * constructionCount;

    score += 10 * diversionCount;

    score += 10 * eventCount;

    score += 10 * hotspotCount;


    res.json({
      score,
      constructionCount,
      diversionCount,
      eventCount,
      hotspotCount,
    });
  } catch (error) {
    console.error("Error predicting traffic:", error);
    res.status(500).json({ error: "Error predicting traffic" });
  }
}


