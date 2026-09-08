const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../app/db");

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, password and account type are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();


    // Check existing user
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users
       (name, email, password_hash, account_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, account_type, created_at`,
      [name.trim(), normalizedEmail, passwordHash, accountType]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id, accountType: user.account_type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(201).json({ message: "User registered successfully", token, user });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        accountType: user.account_type,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        account_type: user.account_type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// CURRENT USER
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, account_type, created_at
       FROM users
       WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
};