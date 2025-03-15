import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AIConsultation = () => {
  const [inputs, setInputs] = useState({
    style: "Casual",
    occasion: "Everyday",
    bodyType: "Athletic",
  });
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save user input to Firebase
      await addDoc(collection(db, "user_preferences"), inputs);

      // Call OpenAI API
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a fashion stylist providing outfit recommendations based on user preferences.",
            },
            {
              role: "user",
              content: `I prefer ${inputs.style} fashion, have a ${inputs.bodyType} body type, and need an outfit for ${inputs.occasion}. Suggest an outfit.`,
            },
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRecommendation(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching AI recommendation:", error);
      setRecommendation("Failed to get recommendations. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">AI Fashion Consultation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Preferred Style</span>
            <select name="style" value={inputs.style} onChange={handleChange} className="w-full p-2 border rounded">
              <option>Casual</option>
              <option>Formal</option>
              <option>Streetwear</option>
              <option>Sporty</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Occasion</span>
            <select name="occasion" value={inputs.occasion} onChange={handleChange} className="w-full p-2 border rounded">
              <option>Everyday</option>
              <option>Business Meeting</option>
              <option>Night Out</option>
              <option>Workout</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Body Type</span>
            <select name="bodyType" value={inputs.bodyType} onChange={handleChange} className="w-full p-2 border rounded">
              <option>Athletic</option>
              <option>Curvy</option>
              <option>Slim</option>
              <option>Plus Size</option>
            </select>
          </label>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            type="submit"
            disabled={loading}
          >
            {loading ? "Generating..." : "Get Outfit Suggestion"}
          </motion.button>
        </form>
        {recommendation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 p-4 bg-gray-200 rounded-lg"
          >
            <h3 className="text-lg font-semibold">Recommended Outfit:</h3>
            <p>{recommendation}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AIConsultation;
