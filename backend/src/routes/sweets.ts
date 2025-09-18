import { Router } from 'express';
import {
  getAllSweets,
  getSweetById,
  createSweet,
  updateSweet,
  deleteSweet,
} from '../controllers/sweets';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllSweets);
router.get('/:id', getSweetById);

// Protected routes (Admin only)
router.use(authenticateToken);
router.post('/', requireAdmin, createSweet);
router.put('/:id', requireAdmin, updateSweet);
router.delete('/:id', requireAdmin, deleteSweet);

export default router;
