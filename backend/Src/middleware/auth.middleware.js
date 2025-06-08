import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers("authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //verify the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized invaild token!" });
    }

    req.user = user; // Attach the user to the request object for later use
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
