import express from 'express';
const router = express.Router();
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';

// Import middleware for token authentication
import { authenticateToken } from '../../services/auth.js';

/**
 * Route: '/'
 * Method: POST
 * Description: Creates a new user in the database.
 * Access: Public
 * 
 * Method: PUT
 * Description: Saves a book to the logged-in user's account. Requires authentication.
 * Access: Auth
 */
router.route('/').post(createUser).put(authenticateToken, saveBook);

/**
 * Route: '/login'
 * Method: POST
 * Description: Authenticates a user and returns a token for session management.
 * Access: Public
 */
router.route('/login').post(login);

/**
 * Route: '/me'
 * Method: GET
 * Description: Retrieves the logged-in user's information, including saved books.
 * Access: Auth
 */
router.route('/me').get(authenticateToken, getSingleUser);

/**
 * Route: '/books/:bookId'
 * Method: DELETE
 * Description: Deletes a saved book from the logged-in user's account by book ID.
 * Access: Auth
 */
router.route('/books/:bookId').delete(authenticateToken, deleteBook);

export default router;