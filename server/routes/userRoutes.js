import express from 'express';
import { createUser, findMatches } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/:userId/matches', findMatches);

export default router;