
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