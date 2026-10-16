const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    surname: user.surname,
    email: user.email,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { firstName, surname, email, password } = req.body || {};

    if (
      typeof firstName !== "string" ||
      typeof surname !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    const cleanFirstName = firstName.trim();
    const cleanSurname = surname.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (
      !cleanFirstName ||
      cleanFirstName.length > 50 ||
      !cleanSurname ||
      cleanSurname.length > 50
    ) {
      return res.status(400).json({
        message: "Please enter valid first and last names.",
      });
    }

    if (
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        message: "Password must be 8–128 characters long.",
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: cleanFirstName,
      surname: cleanSurname,
      email: cleanEmail,
      passwordHash,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration failed:", error.message);
    return res.status(500).json({
      message: "Unable to register right now. Please try again.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    return res.json({
      message: "Login successful.",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({
      message: "Unable to log in right now. Please try again.",
    });
  }
});

module.exports = router;
