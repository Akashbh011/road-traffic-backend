import { Garden } from "../models/garden.model.js";



export const createGarden = async (req, res) => {

    try {

        const {

            longitude,

            latitude,

            name,

            capacity

        } = req.body;



        // Validate input and create the garden document

        const newGarden = new Garden({

            longitude,

            latitude,

            name,

            capacity

        });



        // Save the new garden to the database

        const savedGarden = await newGarden.save();

        res.status(201).json({

            message: 'Garden created successfully!',

            data: savedGarden

        });

    } catch (error) {

        res.status(400).json({

            message: 'Error creating garden.',

            error: error.message

        });

    }

};


export const getAllGardens = async (req, res) => {
    try {
        // Fetch all garden documents from the database
        const gardens = await Garden.find({});
        
        // Send a successful response with the data
        res.status(200).json({
            message: 'Gardens fetched successfully!',
            data: gardens
        });
    } catch (error) {
        // Send an error response with the error message
        res.status(500).json({
            message: 'Error fetching gardens.',
            error: error.message
        });
    }
};
