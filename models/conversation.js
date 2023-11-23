const mongoose = require("mongoose");

const messageSchema = {
  text: String,
  sender: String,
  timestamp: Date,
};

const ConversationSchema = new mongoose.Schema({
  bot: String,
  email: String,
  isActive: Boolean,
  createdAt: Date,
  messages: [messageSchema],
  updatedAt: Date,
  user: String,
});

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;
