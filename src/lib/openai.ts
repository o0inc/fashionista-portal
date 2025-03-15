import axios from "axios";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const testOpenAIConnection = async () => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: "Hello, OpenAI!" }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ OpenAI Response:", response.data.choices[0].message.content);
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.response?.data || error.message);
  }
};
console.log("🔑 OpenAI API Key (Loaded):", process.env.NEXT_PUBLIC_OPENAI_API_KEY);
