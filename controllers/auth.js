import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const isUsed = await User.findOne({ userName });

    if (isUsed) {
      return res.json({ message: "That name is used" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      userName,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    
    await newUser.save();

    res.json({ newUser, token, message: "Registration success" });
  } catch (error) {
    res.json({ message: "Error on create user" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      res.json({ message: "Incorrect login or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.json({ message: "Incorrect login or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ token, user, message: "Login success" });
  } catch (error) {
    res.json({ message: "Error can't to logined" });
  }
};
// Get me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.json({ message: "unknown user" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({
      message: "please logined",
    });
  }
};
