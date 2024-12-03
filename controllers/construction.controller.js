
import { Construction } from "../models/construction.model.js";



export const createConstructionProject = async (req, res) => {

    try {

        const {

            projectName,

            vendorName,

            startTime,

            polyline,

            startDate,

            expectedEndDate,

            status

        } = req.body;


        const newConstruction = new Construction({

            projectName,

            vendorName,

            startTime,

            polyline,

            startDate,

            expectedEndDate,

            status

        });



        const savedConstruction = await newConstruction.save();

        res.status(201).json({

            message: 'Construction project created successfully!',

            data: savedConstruction

        });

    } catch (error) {

        res.status(400).json({

            message: 'Error creating construction project.',

            error: error.message

        });

    }

};