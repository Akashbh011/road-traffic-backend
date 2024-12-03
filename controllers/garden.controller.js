

import { Garden } from "../models/Garden.model.js";


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