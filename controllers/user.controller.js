import { User } from '../models/user.model.js';


export const getUserData = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};



