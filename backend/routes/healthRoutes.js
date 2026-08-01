import express from 'express';
import { getHealth } from '../controllers/healthController.js';

const router = express.Router();

router.route('/').get(getHealth);

export default router;
