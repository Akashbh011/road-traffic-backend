import { Event } from '../models/event.model.js';


export const registerEvent = async (req, res) => {
  try {
    const { category, startTime, endTime, location, vehicleCount, crowd } = req.body;

    if (!location || !location.type || !location.coordinates) {
      return res.status(400).json({ message: "Invalid location data." });
    }

    let formattedCoordinates;
    if (location.type === "Point") {
      formattedCoordinates = location.coordinates.map(coord => Number(coord));
    } else if (location.type === "LineString") {
      formattedCoordinates = location.coordinates.map(coord => 
        coord.map(num => Number(num))
      );
    }


    const newEvent = new Event({
      category,
      startTime,
      endTime,
      vehicleCount,
      crowd,
      location: {
        type: location.type,
        coordinates: formattedCoordinates
      }
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering Event: " + error.message });
  }
};



export const getEventDatamodel = async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Server Error: Unable to fetch events' });
    }
  };