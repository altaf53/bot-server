const express = require("express");
const { quranChatController } = require("../controllers");

const chatRoutes = express.Router();

chatRoutes.post("/quran", quranChatController.completeChat);

chatRoutes.get("/:user", quranChatController.getChat);

module.exports = chatRoutes;
