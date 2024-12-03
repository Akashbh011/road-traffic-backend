
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