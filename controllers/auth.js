import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import { config } from "../config/config.js";
import mysql from "mysql2";

export const signup = async (req, res) => {
  const { name, email, hashedPassword } = req.body;

  const pool = mysql.createConnection(config);
  const connection = pool.promise();

  try {
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(404).json({ message: "User already Exist." });
    }

    await connection.query(
      `INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { email: email, id: hashedPassword },
      process.env.JWT_SECRECT,
      {
        expiresIn: "1h",
      }
    );

    const newUserDetail = [];
    newUserDetail.push({
      name,
      email
    });
    res.status(200).json({ result: newUserDetail, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong...");
  } finally {
    connection.end();
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const pool = mysql.createConnection(config);
  const connection = pool.promise();

  try {
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length <= 0) {
      return res.status(404).json({ message: "User does't already Exist." });
    }

    const isPasswordCrt = await bcrypt.compare(
      password,
      rows[0].hashed_password
    );
    
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email, hashed_password :rows[0].hashed_password },
      process.env.JWT_SECRECT,
      {
        expiresIn: "1h",
      }
    );

    const existingUserDetail = [];
    existingUserDetail.push({
      name: rows[0].name,
      email: rows[0].email,
    });

    res.status(200).json({ result: existingUserDetail, token });
  } catch (error) {
    res.status(500).json("Something went wrong...");
  } finally {
    connection.end();
  }
};
