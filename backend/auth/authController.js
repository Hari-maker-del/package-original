const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../app/db");

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

async function supabaseAuth(path, body) {
  const response = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/${path}`, {
    method: "POST",
    headers: { apikey: process.env.SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.msg || data?.message || data?.error_description || data?.error || "Authentication failed");
    error.status = response.status;
    error.code = data?.code || data?.error_code || data?.error || "AUTH_ERROR";
    error.payload = data;
    throw error;
  }
  return data;
}

async function syncUser(authUser, name, accountType = "User") {
  const email = String(authUser.email || "").trim().toLowerCase();
  const metadata = authUser.user_metadata || {};
  const displayName = String(name || metadata.full_name || metadata.name || email.split("@")[0] || "User").trim();
  const existing = await pool.query("SELECT id, name, email, account_type, created_at FROM users WHERE email = $1", [email]);

  if (existing.rows.length) {
    const current = existing.rows[0];
    const result = await pool.query(
      `UPDATE users SET name = $1, account_type = $2 WHERE id = $3
       RETURNING id, name, email, account_type, created_at`,
      [displayName || current.name, current.account_type || accountType, current.id]
    );
    return result.rows[0];
  }

  const result = await pool.query(
    `INSERT INTO users (id, name, email, password_hash, account_type)
     VALUES ($1, $2, $3, NULL, $4)
     RETURNING id, name, email, account_type, created_at`,
    [authUser.id, displayName, email, accountType]
  );
  return result.rows[0];
}

function issueToken(user) {
  return jwt.sign({ userId: user.id, accountType: user.account_type }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

async function legacyLogin(normalizedEmail, password) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
  if (!result.rows.length) return null;
  const user = result.rows[0];
  if (!user.password_hash) return null;
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) return null;
  return {
    message: "Login successful",
    token: issueToken(user),
    user: { id: user.id, name: user.name, email: user.email, account_type: user.account_type },
  };
}

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const accountType = req.body.accountType || "User";
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (!["User", "Compliance Officer"].includes(accountType)) return res.status(400).json({ message: "Invalid account type" });
    if (String(password).length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const normalizedEmail = email.trim().toLowerCase();

    if (supabaseConfigured()) {
      const data = await supabaseAuth("signup", {
        email: normalizedEmail,
        password,
        options: { data: { full_name: name.trim(), account_type: accountType } },
      });
      if (!data.user) {
        const reason = data?.msg || data?.message || data?.error_description || data?.error || "Supabase returned no user";
        return res.status(502).json({
          message: `Supabase signup did not create a user: ${reason}`,
          code: data?.code || data?.error_code || data?.error || "NO_USER_RETURNED",
        });
      }
      const user = await syncUser(data.user, name, accountType);
      if (!data.session) {
        return res.status(201).json({ message: "Account created. Please verify your email before signing in.", verificationRequired: true, user });
      }
      return res.status(201).json({ message: "User registered successfully", token: issueToken(user), user });
    }

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existingUser.rows.length) return res.status(409).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, account_type) VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, account_type, created_at`,
      [name.trim(), normalizedEmail, passwordHash, accountType]
    );
    const user = result.rows[0];
    return res.status(201).json({ message: "User registered successfully", token: issueToken(user), user });
  } catch (error) {
    console.error("Signup error:", error);
    const status = error?.status === 422 ? 400 : error?.status === 429 ? 429 : 500;
    return res.status(status).json({
      message: status === 500 ? "Signup failed" : error?.message || "Signup failed",
      code: error?.code || "UNKNOWN",
      detail: String(error?.message || "Unknown error").slice(0, 300),
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const normalizedEmail = email.trim().toLowerCase();

    if (supabaseConfigured()) {
      try {
        const data = await supabaseAuth("token?grant_type=password", { email: normalizedEmail, password });
        if (data.user) {
          const accountType = data.user.user_metadata?.account_type || "User";
          const user = await syncUser(data.user, data.user.user_metadata?.full_name, accountType);
          return res.json({ message: "Login successful", token: issueToken(user), user });
        }
      } catch (error) {
        if (error?.status !== 400 && error?.status !== 401) throw error;
        const legacy = await legacyLogin(normalizedEmail, password);
        if (legacy) return res.json(legacy);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const legacy = await legacyLogin(normalizedEmail, password);
    if (!legacy) return res.status(401).json({ message: "Invalid email or password" });
    return res.json(legacy);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed", code: error?.code || "UNKNOWN", detail: String(error?.message || "Unknown error").slice(0, 300) });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name, email, account_type, created_at FROM users WHERE id = $1`, [req.user.userId]);
    if (!result.rows.length) return res.status(404).json({ message: "User not found" });
    return res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, getMe };
