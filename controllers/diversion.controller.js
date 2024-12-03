
import { Diversion } from "../models/diversion.model.js";


export const createDiversion = async (req, res) => {

    try {

        const {

            projectName,

            vendorName,

            startTime,

            endTime,

            longitude,

            latitude,

            type

        } = req.body;



        // Validate input and create the diversion document

        const newDiversion = new Diversion({

            projectName,

            vendorName,

            startTime,

            endTime,

            longitude,

            latitude,

            type

        });



        // Save the new diversion to the database

        const savedDiversion = await newDiversion.save();

        res.status(201).json({

            message: 'Diversion created successfully!',

            data: savedDiversion

        });

    } catch (error) {

        res.status(400).json({

            message: 'Error creating diversion.',

            error: error.message

        });

    }

};