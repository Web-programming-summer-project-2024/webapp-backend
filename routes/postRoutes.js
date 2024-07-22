

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
  searchPosts
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
