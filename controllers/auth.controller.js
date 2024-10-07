import { User } from "../models/user.model.js"; // Adjust the import path as needed
import jwt from "jsonwebtoken";
// Function to handle user registration
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, mobile_number } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ mobile_number });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this phone number already exists" });
    }

    const newUser = new User({ username, email, password, mobile_number });
    const savedUser = await newUser.save();
    console.log("new user has been saved !");
    // console.log(savedUser);

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const info = await User.findOne({ username: username, password: password });
    if (!info) {
      console.log("hi");
      return res.status(400).json({ message: "please do registration first" });
    }else{
      console.log(info)
    }

    const user = info._doc;
    console.log(user);

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;
    console.log(userInfo);

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
//  export const login /reg
