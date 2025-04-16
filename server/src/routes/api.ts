import { Router } from 'express';
import { createUser, login, saveBook, deleteBook, getMe } from '../controllers/user-controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'API is working!' });
});

// Route to create a new user
router.post('/users', createUser);

// Route to log in a user
router.post('/users/login', login);

// Route to get the authenticated user's data (protected)
router.get('/users/me', authMiddleware, getMe);

// Route to save a book (protected)
router.post('/users/books', authMiddleware, saveBook);

// Route to delete a book (protected)
router.delete('/users/books/:bookId', authMiddleware, deleteBook);

export default router;