import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { updateProfile, getProfile } from '../controllers/profileController.js';

const router = express.Router();

router.get('/:userId?', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);

export default router;