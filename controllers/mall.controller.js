
import { Mall } from "../models/mall.model.js";


export const createMall = async (req, res) => {

    try {

        const {

            longitude,

            latitude,

            name,

            parkingCapacity

        } = req.body;



        const newMall = new Mall({

            longitude,

            latitude,

            name,

            parkingCapacity

        });


        const savedMall = await newMall.save();

        res.status(201).json({

            message: 'Mall created successfully!',

            data: savedMall

        });

    } catch (error) {

        res.status(400).json({

            message: 'Error creating mall.',

            error: error.message

        });

    }

};


export const getAllMalls = async (req, res) => {
    try {
        // Fetch all mall documents from the database
        const malls = await Mall.find({});
        
        // Send a successful response with the data
        res.status(200).json(malls);
    } catch (error) {
        // Send an error response with the error message
        res.status(500).json({
            message: 'Error fetching malls.',
            error: error.message
        });
    }
};
