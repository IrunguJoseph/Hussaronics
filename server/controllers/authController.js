import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req, res) => {
  try {
    const userData = registerSchema.parse(req.body);
    const conn = await pool.getConnection();

    try {
      // Check if user exists
      const [existingUser] = await conn.query(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const [result] = await conn.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [userData.name, userData.email, hashedPassword]
      );

      // Generate token
      const token = jwt.sign(
        { userId: result.insertId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: result.insertId,
          name: userData.name,
          email: userData.email,
        },
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const conn = await pool.getConnection();

    try {
      const [users] = await conn.query(
        'SELECT id, name, email, password FROM users WHERE email = ?',
        [credentials.email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      const validPassword = await bcrypt.compare(
        credentials.password,
        user.password
      );

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};