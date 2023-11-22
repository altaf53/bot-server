const Pinecone = require("@pinecone-database/pinecone").Pinecone;
const PineconeStore = require("langchain/vectorstores/pinecone").PineconeStore;
const OpenAIEmbeddings =
  require("langchain/embeddings/openai").OpenAIEmbeddings;
const OpenAI = require("openai");

const completeChat = async (req, res, next) => {
  try {
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

    res.json({
      text: chatCompletion.choices[0].message.content,
      results,
      chatCompletion,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  completeChat,
};
