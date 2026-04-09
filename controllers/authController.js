const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async (request, h) => {
  const { username, email, password } = request.payload;
  console.log("Registering user:", { username, email, password });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [username, email, passwordHash],
    );
    return h
      .response({ message: "User registered", userId: result.rows[0].id })
      .code(201);
  } catch (err) {
    if (err.code === "23505")
      return h
        .response({ error: "Username or email already exists" })
        .code(409);
    throw err;
  }
};

//login
const login = async (request, h) => {
  const { email, password } = request.payload;

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return h.response({ error: "Invalid credentials" }).code(401);
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  return h.response({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
    })
    .state("token", token);
};

module.exports = {
  register,
  login,
};
