
import { Hotel } from "../models/hotel.model.js"; 


export const createHotel = async (req, res) => {

    try {

        const {

            longitude,

            latitude,

            name,

            parkingCapacity,

            crowdCapacity

        } = req.body;



        const newHotel = new Hotel({

            longitude,

            latitude,

            name,

            parkingCapacity,

            crowdCapacity

        });


        const savedHotel = await newHotel.save();

        res.status(201).json({

            message: 'Hotel created successfully!',

            data: savedHotel

        });

    } catch (error) {

        res.status(400).json({

            message: 'Error creating hotel.',

            error: error.message

        });

    }

};


export const getAllHotels = async (req, res) => {
    try {
        // Fetch all hotel documents from the database
        const hotels = await Hotel.find({});
        
        // Send a successful response with the data
        res.status(200).json({
            message: 'Hotels fetched successfully!',
            data: hotels
        });
    } catch (error) {
        // Send an error response with the error message
        res.status(500).json({
            message: 'Error fetching hotels.',
            error: error.message
        });
    }
};
