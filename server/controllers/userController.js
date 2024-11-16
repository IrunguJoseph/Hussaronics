import pool from '../config/db.js';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  skills_offering: z.array(z.object({
    name: z.string(),
    proficiency_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'])
  })),
  skills_seeking: z.array(z.string()),
  availability: z.array(z.object({
    day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    time_slot: z.enum(['morning', 'afternoon', 'evening'])
  }))
});

export const createUser = async (req, res) => {
  try {
    const userData = userSchema.parse(req.body);
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Insert user
      const [userResult] = await conn.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [userData.name, userData.email]
      );
      const userId = userResult.insertId;

      // Insert skills offering
      for (const skill of userData.skills_offering) {
        const [skillResult] = await conn.query(
          'INSERT IGNORE INTO skills (name) VALUES (?)',
          [skill.name]
        );
        const skillId = skillResult.insertId;

        await conn.query(
          'INSERT INTO user_skills (user_id, skill_id, proficiency_level, is_offering, is_seeking) VALUES (?, ?, ?, true, false)',
          [userId, skillId, skill.proficiency_level]
        );
      }

      // Insert skills seeking
      for (const skillName of userData.skills_seeking) {
        const [skillResult] = await conn.query(
          'INSERT IGNORE INTO skills (name) VALUES (?)',
          [skillName]
        );
        const skillId = skillResult.insertId;

        await conn.query(
          'INSERT INTO user_skills (user_id, skill_id, proficiency_level, is_offering, is_seeking) VALUES (?, ?, "beginner", false, true)',
          [userId, skillId]
        );
      }

      // Insert availability
      for (const slot of userData.availability) {
        await conn.query(
          'INSERT INTO availability (user_id, day_of_week, time_slot) VALUES (?, ?, ?)',
          [userId, slot.day_of_week, slot.time_slot]
        );
      }

      await conn.commit();
      res.status(201).json({ 
        message: 'User profile created successfully',
        userId 
      });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
};

export const findMatches = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const [matches] = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.rating,
        GROUP_CONCAT(DISTINCT CASE 
          WHEN us_offering.is_offering = 1 
          THEN s_offering.name 
        END) as skills_offering,
        GROUP_CONCAT(DISTINCT CASE 
          WHEN us_seeking.is_seeking = 1 
          THEN s_seeking.name 
        END) as skills_seeking,
        COUNT(DISTINCT a.id) as matching_availability_slots
      FROM users u
      INNER JOIN user_skills us_offering ON u.id = us_offering.user_id
      INNER JOIN skills s_offering ON us_offering.skill_id = s_offering.id
      INNER JOIN user_skills us_seeking ON u.id = us_seeking.user_id
      INNER JOIN skills s_seeking ON us_seeking.skill_id = s_seeking.id
      LEFT JOIN availability a ON u.id = a.user_id
      WHERE 
        u.id != ? AND
        EXISTS (
          SELECT 1 FROM user_skills us1
          JOIN skills s1 ON us1.skill_id = s1.id
          WHERE us1.user_id = ? AND us1.is_seeking = 1
          AND s1.name = s_offering.name
        ) AND
        EXISTS (
          SELECT 1 FROM user_skills us2
          JOIN skills s2 ON us2.skill_id = s2.id
          WHERE us2.user_id = u.id AND us2.is_seeking = 1
          AND s2.name IN (
            SELECT s3.name FROM user_skills us3
            JOIN skills s3 ON us3.skill_id = s3.id
            WHERE us3.user_id = ? AND us3.is_offering = 1
          )
        )
      GROUP BY u.id
      ORDER BY matching_availability_slots DESC, u.rating DESC
    `, [userId, userId, userId]);

    res.json(matches.map(match => ({
      ...match,
      skills_offering: match.skills_offering?.split(',') || [],
      skills_seeking: match.skills_seeking?.split(',') || []
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};