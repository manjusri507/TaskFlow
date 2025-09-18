// middleware/authMiddleware.js
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("authorization");
  console.log("Incoming token:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Find user by token (since you're saving token in DB on login)
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = authMiddleware;
