import { Complaint } from '../models/complaint.model.js';


export const getComplaintDatamodel = async (req, res) => {
    try {
      console.log("this is the backend call !");
        const complaints = await Complaint.find({});
        console.log(complaints);
        res.json(complaints);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching complaints' });
    }
  };
  
  //  export const login /reg
  