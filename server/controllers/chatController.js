// chatController.js
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const ChatMessage = require('../models/ChatMessage');
const Product = require('../models/Product');
const geminiService = require('../services/geminiService');
const mongoose = require('mongoose');

/**
 * Send a chat message and get AI response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Chat message with AI response
 */
const sendMessage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Validation errors', errors.array());
  }

  const { message, sessionId } = req.body;

  if (!message || message.trim().length === 0) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Message cannot be empty');
  }

  if (message.length > 1000) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Message cannot exceed 1000 characters');
  }

  const finalSessionId = sessionId || new mongoose.Types.ObjectId().toString();

  // Fetch related products for inventory context
  const relatedProducts = await Product.find(
    { $text: { $search: message } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } }).limit(5).catch(() => []);

  let result;
  try {
    result = await geminiService.sendChatMessage(
      req.user._id,
      finalSessionId,
      message,
      relatedProducts
    );
  } catch (error) {
    console.error('Gemini error:', error);
    return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Error processing chat message');
  }

  const assistantMessage = {
    _id: `model-${Date.now()}`,
    sessionId: finalSessionId,
    userId: req.user._id,
    content: result.response,
    role: 'model',
    createdAt: new Date().toISOString(),
    feedbackRating: 0,
    tokensUsed: result.tokensUsed || 0
  };

  return ApiResponse.success(res, StatusCodes.OK, {
    sessionId: finalSessionId,
    assistantMessage,
    relatedProducts
  }, 'Message processed successfully');
});

/**
 * Get chat history for user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Grouped chat history by sessionId
 */
const getChatHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build filter based on user role
  let filter = {};
  if (req.user.role === 'farmer') {
    filter.userId = req.user._id;
  }

  // Get all messages and group by sessionId
  const allMessages = await ChatMessage.find(filter)
    .sort({ createdAt: -1 });

  // Group by sessionId
  const sessions = {};
  allMessages.forEach(msg => {
    if (!sessions[msg.sessionId]) {
      sessions[msg.sessionId] = [];
    }
    sessions[msg.sessionId].push(msg);
  });

  // Convert to array and paginate
  const sessionArray = Object.entries(sessions).map(([sessionId, messages]) => ({
    sessionId,
    messages: messages.sort((a, b) => a.createdAt - b.createdAt),
    lastMessage: messages[0].createdAt,
    messageCount: messages.length
  }));

  sessionArray.sort((a, b) => b.lastMessage - a.lastMessage);
  const paginatedSessions = sessionArray.slice(skip, skip + parseInt(limit));

  return ApiResponse.success(res, StatusCodes.OK, {
    sessions: paginatedSessions,
    pagination: {
      total: sessionArray.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(sessionArray.length / parseInt(limit))
    }
  }, 'Chat history retrieved successfully');
});

/**
 * Get messages for a specific chat session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Paginated messages for session
 */
const getChatSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Find messages for session
  const messages = await ChatMessage.find({ sessionId });

  if (messages.length === 0) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Chat session not found');
  }

  // Check ownership if farmer
  if (req.user.role === 'farmer' && messages[0].userId.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, StatusCodes.FORBIDDEN, 'Access denied to this session');
  }

  // Paginate messages
  const paginatedMessages = messages
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(skip, skip + parseInt(limit));

  return ApiResponse.success(res, StatusCodes.OK, {
    sessionId,
    messages: paginatedMessages,
    pagination: {
      total: messages.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(messages.length / parseInt(limit))
    }
  }, 'Chat session retrieved successfully');
});

/**
 * Rate a chat message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Updated message with rating
 */
const rateMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { feedbackRating } = req.body;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Invalid message ID — message not yet saved');
  }

  if (!feedbackRating || ![1, 2, 3, 4, 5].includes(feedbackRating)) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Rating must be between 1 and 5');
  }

  const message = await ChatMessage.findById(messageId);
  if (!message) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Message not found');
  }

  // Farmers can only rate their own messages
  if (req.user.role === 'farmer' && message.userId.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, StatusCodes.FORBIDDEN, 'Can only rate your own messages');
  }

  message.feedbackRating = feedbackRating;
  await message.save();

  return ApiResponse.success(res, StatusCodes.OK, message, 'Message rated successfully');
});

/**
 * Bookmark or unbookmark a message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Updated message with bookmark status
 */
const bookmarkMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await ChatMessage.findById(messageId);
  if (!message) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Message not found');
  }

  // Farmers can only bookmark their own messages
  if (req.user.role === 'farmer' && message.userId.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, StatusCodes.FORBIDDEN, 'Can only bookmark your own messages');
  }

  // Toggle bookmark
  message.isBookmarked = !message.isBookmarked;
  await message.save();

  return ApiResponse.success(
    res,
    StatusCodes.OK,
    message,
    `Message ${message.isBookmarked ? 'bookmarked' : 'un-bookmarked'} successfully`
  );
});

/**
 * Delete a chat session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
const deleteChatSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  // Find all messages in session
  const messages = await ChatMessage.find({ sessionId });
  if (messages.length === 0) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Chat session not found');
  }

  // Check ownership if farmer
  if (req.user.role === 'farmer' && messages[0].userId.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, StatusCodes.FORBIDDEN, 'Can only delete your own sessions');
  }

  // Delete all messages in session
  await ChatMessage.deleteMany({ sessionId });

  return ApiResponse.success(res, StatusCodes.OK, null, 'Chat session deleted successfully');
});

module.exports = {
  sendMessage,
  getChatHistory,
  getChatSession,
  rateMessage,
  bookmarkMessage,
  deleteChatSession
};