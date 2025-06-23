import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import "dotenv/config";
const JWT_SECRET = '5sfgU3OZO8f+Rw+Cr8R7/f51Q/0cJFQiHoL0R0Nmk84=';
const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    console.log("JWT_SECRET:",JWT_SECRET);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware Authentication error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default protectRoute;
