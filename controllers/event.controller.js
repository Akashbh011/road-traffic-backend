import { Event } from '../models/event.model.js';


export const registerEvent = async (req, res) => {
  try {

    const {
      category,
      startTime,
      endTime,
      vehicleCount,
      crowd,
      eventPoints,
    } = req.body;

    if (!Array.isArray(eventPoints) || eventPoints.length === 0) {
      return res.status(400).json({
        message: 'Event points must be a non-empty array of lat-lng objects.',
      });
    }

    for (const point of eventPoints) {
      if (
        typeof point.lat !== 'number' ||
        typeof point.lng !== 'number'
      ) {
        return res.status(400).json({
          message: 'Each event point must contain valid "lat" and "lng" as numbers.',
        });
      }
    }


    const newEvent = new Event({
      category,
      startTime,
      endTime,
      vehicleCount,
      crowd,
      eventPoints,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({
      message: 'Event created successfully!',
      data: savedEvent,
    });
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