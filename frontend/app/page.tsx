'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';

interface AnimeType {
  id: number;
  title: string;
  genres: string[];
}

export default function Home() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<AnimeType[]>([]);
  const [error, setError] = useState<string>('');

  const questions = [
    { id: 'mood', text: 'Current mood?', options: ['Energetic', 'Calm', 'Sad', 'Excited'] },
    // Add more questions
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/anime/recommend`, { answers: Object.values(answers) });
      setRecommendations(response.data);
    } catch (error) {
      console.error(error);
      setError('Failed to get recommendations. Please check your internet connection and make sure all questions are answered, then try again.');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Anime Recommender</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <label htmlFor={q.id} className="block mb-2">{q.text}</label>
            <select
              id={q.id}
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
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-8">
        {recommendations.map((anime: AnimeType) => (
          <div key={anime.id} className="border p-4 mb-2">
            <h2>{anime.title}</h2>
            <p>Genres: {anime.genres.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
