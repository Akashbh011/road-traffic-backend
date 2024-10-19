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

export const makeAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = 'admin';
        await user.save();

        res.json({ message: 'User role updated to admin' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user role' });
    }
};


