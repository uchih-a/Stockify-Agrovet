const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const chatMessageSchema = new mongoose.Schema(
  {
    // User who sent the message or received the response
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Session ID to group related messages in a conversation
    sessionId: {
      type: String,
      required: [true, 'Please provide a session ID']
    },

    // Who is the speaker: 'user' or 'model' (Gemini)
    role: {
      type: String,
      required: [true, 'Please provide a role'],
      enum: ['user', 'model']
    },

    // The actual message content
    content: {
      type: String,
      required: [true, 'Please provide message content'],
      maxlength: [4000, 'Message cannot exceed 4000 characters']
    },

    // Products mentioned or referenced in the AI response
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],

    // User feedback rating (1-5 stars) for model responses
    feedbackRating: {
      type: Number,
      enum: [1, 2, 3, 4, 5]
    },

    // Whether user bookmarked this message
    isBookmarked: {
      type: Boolean,
      default: false
    },

    // Number of tokens used by Gemini for the response
    tokensUsed: Number
  },
  { timestamps: true }
);

// Add pagination plugin
chatMessageSchema.plugin(mongoosePaginate);

// Indexes for performance
chatMessageSchema.index({ userId: 1, sessionId: 1 });
chatMessageSchema.index({ userId: 1, createdAt: -1 });
chatMessageSchema.index({ sessionId: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
