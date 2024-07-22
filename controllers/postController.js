
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');



/**
 * This function handles the creation of a new post.
 * It takes the title, description, user ID, and image URL from the request,
 * creates a new post in the database, and returns the post data.
 */

const createPost = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;
    const post = await Post.createPost(title, description, req.user.id, imageUrl);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * This function retrieves all posts from the database.
 */
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.getPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * This function retrieves a post by its ID.
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.getPostById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This function updates a post by its ID.
 */
const updatePost = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;
    const post = await Post.updatePost(req.params.id, title, description, imageUrl);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * This function deletes a post by its ID.
 */
const deletePost = async (req, res, next) => {
  try {
    await Post.deletePost(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * This function increments the like count of a post by its ID.
 * It first checks if the user has already liked the post.
 * If not, it increments the like count and adds a record to the likes table.
 */
const likePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const alreadyLiked = await Like.checkIfLiked(userId, postId);
    if (alreadyLiked) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }

    await Like.addLike(userId, postId);
    const post = await Post.incrementLikes(postId);

    res.json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * This function creates a new comment for a post.
 */
const createComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const comment = await Comment.createComment(text, req.user.id, req.params.postId);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * This function retrieves all comments for a post by the post's ID.
 */
const getCommentsByPostId = async (req, res, next) => {
  try {
    const comments = await Comment.getCommentsByPostId(req.params.postId);
    if (comments.length === 0) {
      res.status(200).json({ message: 'No comments found for this post' });
    } else {
      res.json(comments);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This function deletes a comment by its ID.
 */
const deleteComment = async (req, res, next) => {
  try {
    const result = await Comment.deleteComment(req.params.commentId);
    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json({ message: 'Comment deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This function searches for posts that match a query.
 */
const searchPosts = async (req, res, next) => {
  try {
    const { query } = req.query;
    const posts = await Post.searchPosts(query);
    if (posts.length === 0) {
      res.status(200).json({ message: 'No match found' });
    } else {
      res.json(posts);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
