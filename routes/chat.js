const express = require("express");
const { quranChatController } = require("../controllers");

const chatRoutes = express.Router();

chatRoutes.post("/quran", quranChatController.completeChat);

module.exports = chatRoutes;
