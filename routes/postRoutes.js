const express = require('express');
const { check } = require('express-validator');
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
} = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, upload.single('image'), [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('description').not().isEmpty().withMessage('Description is required')
  ], validate, createPost);

router.route('/search')
  .get([
    check('query').not().isEmpty().withMessage('Search query is required')
  ], validate, searchPosts);

router.route('/filter')
  .get([
    check('author').optional().notEmpty().withMessage('Author cannot be empty'),
    check('startDate').optional().isISO8601().toDate().withMessage('Invalid start date'),
    check('endDate').optional().isISO8601().toDate().withMessage('Invalid end date'),
    check('sortBy').optional().isIn(['recent', 'likes']).withMessage('Invalid sort option'),
    check('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    check('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
  ], validate, filterPosts);

router.route('/:id')
  .get(getPostById)
  .put(protect, upload.single('image'), [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('description').not().isEmpty().withMessage('Description is required')
  ], validate, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like')
  .post(protect, likePost);

router.route('/:postId/comments')
  .post(protect, [
    check('text').not().isEmpty().withMessage('Comment text is required')
  ], validate, createComment)
  .get(getCommentsByPostId);

router.route('/:postId/comments/:commentId')
  .delete(protect, deleteComment);

module.exports = router;
