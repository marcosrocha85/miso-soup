'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  const questions = [
    { id: 'mood', text: 'Current mood?', options: ['Energetic', 'Calm', 'Sad', 'Excited'] },
    // Add more questions
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3003/anime/recommend', { answers: Object.values(answers) });
      setRecommendations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Anime Recommender</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <label className="block mb-2">{q.text}</label>
            <select
              className="border p-2"
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            >
              <option value="">Select</option>
              {q.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2">Get Recommendations</button>
      </form>
      <div className="mt-8">
        {recommendations.map((anime) => (
          <div key={anime.id} className="border p-4 mb-2">
            <h2>{anime.title}</h2>
            <p>Genres: {anime.genres.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
