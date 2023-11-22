const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  timestamp: Date,
});

const ConversationSchema = new mongoose.Schema({
  bot: String,
  email: String,
  isActive: Boolean,
  createdAt: Date,
  messages: [messageSchema],
  updatedAt: Date,
  user: String,
});

module.exports = mongoose.model("Conversation", ConversationSchema);
