const express = require('express');
const { check, validationResult } = require('express-validator');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  createComment,
  getCommentsByPostId,
  deleteComment,
  searchPosts,
  filterPosts,
  getMostLikedPosts
} = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation error", errors: errors.array() });
  }
  next();
};

router.route('/')
  .get(getPosts)
  .post(protect, upload.single('image'), [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('description').not().isEmpty().withMessage('Description is required')
  ], validateRequest, createPost);

router.route('/search')
  .get([
    check('query').not().isEmpty().withMessage('Search query is required')
  ], validateRequest, searchPosts);

router.route('/filter')
  .get([
    check('author').optional().notEmpty().withMessage('Author cannot be empty'),
    check('startDate').optional().isISO8601().toDate().withMessage('Invalid start date'),
    check('endDate').optional().isISO8601().toDate().withMessage('Invalid end date'),
    check('sortByRecent').optional().isBoolean().withMessage('sortByRecent must be a boolean'),
    check('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    check('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
  ], validateRequest, filterPosts);

router.route('/most-liked')
  .get([
    check('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    check('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
  ], validateRequest, getMostLikedPosts);

router.route('/:id')
  .get(getPostById)
  .put(protect, upload.single('image'), [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('description').not().isEmpty().withMessage('Description is required')
  ], validateRequest, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like')
  .post(protect, likePost);

router.route('/:postId/comments')
  .post(protect, [
    check('text').not().isEmpty().withMessage('Comment text is required')
  ], validateRequest, createComment)
  .get(getCommentsByPostId);

router.route('/:postId/comments/:commentId')
  .delete(protect, deleteComment);

module.exports = router;
