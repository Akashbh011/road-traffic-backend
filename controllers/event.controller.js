import { Event } from '../models/event.model.js';


export const registerEvent = async (req, res) => {
    try {
        const {  userId,lng , lat , category, startTime, endTime } = req.body;
    
        const newEvent = new Event({ user:userId,longitude:lng ,latitude: lat ,category:category, startTime:startTime, endTime:endTime});
        const savedEvent = await newEvent.save();
        console.log("New Event has been saved !");
    
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering Event' });
    }
};

export const getEventDatamodel = async (req, res) => {

};
