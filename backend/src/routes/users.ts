import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All user routes require authentication and admin privileges
router.use(authenticateToken, requireAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
