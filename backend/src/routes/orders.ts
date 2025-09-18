import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from '../controllers/orders';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All order routes require authentication
router.use(authenticateToken);

// Public authenticated routes
router.post('/', createOrder);

// Admin routes
router.get('/', requireAdmin, getAllOrders);
router.get('/:id', requireAdmin, getOrderById);
router.put('/:id', requireAdmin, updateOrderStatus);

export default router;
