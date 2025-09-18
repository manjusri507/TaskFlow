const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register new user
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate random token
    const token = Math.random().toString(36).substring(2, 12).toUpperCase();

    // save token in user record (temporary session)
    user.token = token;
    await user.save();

    res.json({
      email: user.email,
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login };
