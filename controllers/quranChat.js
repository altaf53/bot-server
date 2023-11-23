const Pinecone = require("@pinecone-database/pinecone").Pinecone;
const PineconeStore = require("langchain/vectorstores/pinecone").PineconeStore;
const OpenAIEmbeddings =
  require("langchain/embeddings/openai").OpenAIEmbeddings;
const OpenAI = require("openai");
const conversationService = require("../services/conversationService");

const completeChat = async (req, res, next) => {
  try {
    const queryTimestamp = new Date();
    const client = new Pinecone();

    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPEN_API_KEY,
        temperature: 0,
      }),
      { pineconeIndex }
    );

    const results = await vectorStore.similaritySearch(req.body.query, 3);

    const contexts = results.map((embedding) => embedding.pageContent);

    console.log("contexts", contexts);

    const openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "The assistant is an AI system created to answer people's questions about Islam. It has studied the Quran to gain knowledge, but is not itself an Islamic scholar. When answering questions, the assistant will strive to provide helpful, polite and honest responses based solely on its understanding of the Quran. If the Quran does not provide enough context for the assistant to confidently answer a question, it will politely state that it does not have enough information to speculate a response. As an AI system without personal religious views, its role is to provide accurate information to facilitate respectful dialogue, not make definitive judgements on religious matters. The assistant will refrain from providing any misinformation or personal interpretations, especially for sensitive topics.",
        },
        {
          role: "user",
          content: `query: ${req.body.query} /n quran: ${contexts}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    // let conversation;
    // const mssg = "nothing";
    if (!req.body.user) {
      conversation = await conversationService.create({
        query: req.body.query,
        reply: chatCompletion.choices[0].message.content,
        botTimestamp: new Date(),
        queryTimestamp,
      });

      console.log("conversation", conversation);
    } else {
      conversation = await conversationService.addMessage({
        userIdToUpdate: req.body.user,
        newMessages: [
          { text: req.body.query, sender: "user", timestamp: queryTimestamp },
          {
            text: chatCompletion.choices[0].message.content,
            sender: "bot",
            timestamp: new Date(),
          },
        ],
      });
    }
    // chatCompletion.choices[0].message.content
    res.json({
      text: chatCompletion.choices[0].message.content,
      results,
      chatCompletion,
      user: conversation.user,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.toString() });
  }
};

const getChat = async (req, res, next) => {
  try {
    const conversation = await conversationService.findByUser(req.params.user);
    if (conversation) {
      const sortedConversation = conversation.messages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      const formattedConversation = sortedConversation.map((convo) => {
        return {
          by: convo.sender,
          text: convo.text,
        };
      });

      res.json({
        conversation: formattedConversation,
      });
    } else {
      res.json({
        conversation: [],
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  completeChat,
  getChat,
};
