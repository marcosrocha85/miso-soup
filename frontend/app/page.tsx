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
    const [loading, setLoading] = useState<boolean>(false);
    
    const questions = [
        {
            id: 'ei1',
            text: '1. At a party, you prefer to:',
            options: [
                { label: 'Interact with many people', value: '0' },
                { label: 'Interact with few close friends', value: '1' },
            ],
        },
        {
            id: 'sn1',
            text: '2. You focus more on:',
            options: [
                { label: 'Concrete facts and practical details', value: '0' },
                { label: 'Abstract ideas and future possibilities', value: '1' },
            ],
        },
        {
            id: 'tf1',
            text: '3. When making decisions, you prioritize:',
            options: [
                { label: 'Objective logic and fairness', value: '0' },
                { label: 'Personal values and impact on people', value: '1' },
            ],
        },
        {
            id: 'jp1',
            text: '4. You prefer to live with:',
            options: [
                { label: 'Organized plans and structure', value: '0' },
                { label: 'Flexibility and open options', value: '1' },
            ],
        },
        {
            id: 'ei2',
            text: '5. In group settings, you:',
            options: [
                { label: 'Talk a lot and energize the environment', value: '0' },
                { label: 'Listen more and reflect internally', value: '1' },
            ],
        },
        {
            id: 'sn2',
            text: '6. You are more interested in:',
            options: [
                { label: 'Current reality and sensory experiences', value: '0' },
                { label: 'Future, theories, and deep meanings', value: '1' },
            ],
        },
        {
            id: 'tf2',
            text: '7. In conflicts, you resolve with:',
            options: [
                { label: 'Logical and direct arguments', value: '0' },
                { label: 'Empathy and maintaining harmony', value: '1' },
            ],
        },
        {
            id: 'jp2',
            text: '8. Your daily routine:',
            options: [
                { label: 'You like lists and defined deadlines', value: '0' },
                { label: 'You improvise and adapt in the moment', value: '1' },
            ],
        },
        {
            id: 'ei3',
            text: '9. When dealing with new things:',
            options: [
                { label: 'You prefer what is known and proven', value: '0' },
                { label: 'You love exploring the new and unknown', value: '1' },
            ],
        },
        {
            id: 'sn3',
            text: '10. Emotionally:',
            options: [
                { label: 'You maintain distance and objectivity', value: '0' },
                { label: 'You deeply engage with feelings', value: '1' },
            ],
        },
    ];
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Convert answers object to ordered array matching question order
            const answersArray = questions.map((q) => answers[q.id] || '');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/anime/recommend`, { answers: answersArray });
            setRecommendations(response.data);
        } catch (error) {
            console.error(error);
            setError('Failed to get recommendations. Please check your internet connection and make sure all questions are answered, then try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Anime Recommender</h1>
        <form onSubmit={handleSubmit}>
        {questions.map((q) => (
            <div key={q.id} className="mb-4">
            <label htmlFor={q.id} className="block mb-2 font-medium">{q.text}</label>
            <select
            id={q.id}
            className="border p-2 w-full rounded"
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            required
            >
            <option value="" aria-label="Select an option">Select an option</option>
            {q.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            </select>
            </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
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
