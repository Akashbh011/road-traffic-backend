import { Image } from '../models/image.model.js';


export const getPotholeDatamodel = async (req, res) => {
    try {
      console.log("this is the backend call !");
        const images = await Image.find({});
        console.log(images);
        res.json(images);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching pothole images' });
    }
  };
  
  //  export const login /reg
  