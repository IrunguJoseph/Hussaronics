import pool from '../config/db.js';
import { z } from 'zod';

const profileSchema = z.object({
  avatar_url: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  timezone: z.string().optional(),
  github_url: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
});

export const updateProfile = async (req, res) => {
  try {
    const profileData = profileSchema.parse(req.body);
    const userId = req.user.userId;
    const conn = await pool.getConnection();

    try {
      const [result] = await conn.query(
        `UPDATE users 
         SET avatar_url = COALESCE(?, avatar_url),
             bio = COALESCE(?, bio),
             timezone = COALESCE(?, timezone),
             github_url = COALESCE(?, github_url),
             linkedin_url = COALESCE(?, linkedin_url)
         WHERE id = ?`,
        [
          profileData.avatar_url,
          profileData.bio,
          profileData.timezone,
          profileData.github_url,
          profileData.linkedin_url,
          userId,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Profile updated successfully' });
    } finally {
      conn.release();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const conn = await pool.getConnection();

    try {
      const [users] = await conn.query(
        `SELECT 
          u.id, u.name, u.email, u.avatar_url, u.bio, u.timezone,
          u.github_url, u.linkedin_url, u.rating,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'skill_name', s.name,
              'proficiency_level', us.proficiency_level,
              'is_offering', us.is_offering,
              'is_seeking', us.is_seeking
            )
          ) as skills,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'day_of_week', a.day_of_week,
              'time_slot', a.time_slot
            )
          ) as availability
        FROM users u
        LEFT JOIN user_skills us ON u.id = us.user_id
        LEFT JOIN skills s ON us.skill_id = s.id
        LEFT JOIN availability a ON u.id = a.user_id
        WHERE u.id = ?
        GROUP BY u.id`,
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = users[0];
      user.skills = JSON.parse(user.skills);
      user.availability = JSON.parse(user.availability);

      res.json(user);
    } finally {
      conn.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};