const { v4: uuidv4 } = require("uuid");
const Conversation = require("../models/conversation");

const create = async ({ query, reply, botTimestamp, queryTimestamp }) => {
  try {
    const newConversation = new Conversation({
      bot: "Quran",
      email: "user@example.com", //dummy for now
      isActive: true,
      createdAt: new Date(),
      messages: [
        { text: query, sender: "user", timestamp: queryTimestamp },
        { text: reply, sender: "bot", timestamp: botTimestamp },
      ],
      updatedAt: new Date(),
      user: uuidv4(),
    });
    const savedConversation = await newConversation.save();

    return savedConversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
  }
};

const addMessage = async ({ userIdToUpdate, newMessages }) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { user: userIdToUpdate },
      {
        $push: {
          messages: { $each: newMessages },
        },
        updatedAt: new Date(),
      },
      { new: true, useFindAndModify: false }
    );
    return conversation;
  } catch (error) {
    console.error("Error updating conversation:", error);
  }
};

const findByUser = async (userIdToFind) => {
  try {
    const conversation = await Conversation.findOne({ user: userIdToFind });
    console.log("conversation", conversation);
    return conversation;
  } catch (error) {
    console.error("Error finding conversation:", error);
  }
};

module.exports = { create, addMessage, findByUser };
