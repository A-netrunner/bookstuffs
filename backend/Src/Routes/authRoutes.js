import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/Users.js"; // Adjust the path as necessary
const router = express.Router();
const GernerateToken = (userid) => {
  return jwt.sign({ userid }, process.env.JWT_SECRET || "123sdsfr1wd123", {
    expiresIn: "1d",
  });
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "please fill all the fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be at least 6 characters",
      });
    }

    if (password.length < 3) {
      return res.status(400).json({
        message: "username must be at least 3 characters",
      });
    }

    // Check if user already exists
    const existinguser = await User.findOne({ username });
    if (existinguser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //fetch random image for avatar
    const ProfilePic = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
    //create User acc 
    const user = new User({
      username,
      email,
      password,
      profilePic: ProfilePic,
    });

    await user.save();
    // res.status(201).json({ message: "User registered successfully" });

    const token = GernerateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "register failed  server error" });
  }
});

//login route!
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "please fill all the fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400)
        .json({
          message: "user not found! please recheck"
        })
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }
    const token = GernerateToken(user._id);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "login failed server error" });
  }
});

export default router;
