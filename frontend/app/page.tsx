"use client"

import axios from "axios"
import { FormEvent, useState } from "react"

interface AnimeType {
    id: number
    title: string
    genres: string[]
}

export default function Home() {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [recommendations, setRecommendations] = useState<AnimeType[]>([])
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const questions = [
        {
            id: "ei1",
            text: "1. At a party, you prefer to:",
            options: [
                { label: "Interact with many people", value: "0" },
                { label: "Interact with few close friends", value: "1" }
            ]
        },
        {
            id: "sn1",
            text: "2. You focus more on:",
            options: [
                { label: "Concrete facts and practical details", value: "0" },
                {
                    label: "Abstract ideas and future possibilities",
                    value: "1"
                }
            ]
        },
        {
            id: "tf1",
            text: "3. When making decisions, you prioritize:",
            options: [
                { label: "Objective logic and fairness", value: "0" },
                { label: "Personal values and impact on people", value: "1" }
            ]
        },
        {
            id: "jp1",
            text: "4. You prefer to live with:",
            options: [
                { label: "Organized plans and structure", value: "0" },
                { label: "Flexibility and open options", value: "1" }
            ]
        },
        {
            id: "ei2",
            text: "5. In group settings, you:",
            options: [
                {
                    label: "Talk a lot and energize the environment",
                    value: "0"
                },
                { label: "Listen more and reflect internally", value: "1" }
            ]
        },
        {
            id: "sn2",
            text: "6. You are more interested in:",
            options: [
                {
                    label: "Current reality and sensory experiences",
                    value: "0"
                },
                { label: "Future, theories, and deep meanings", value: "1" }
            ]
        },
        {
            id: "tf2",
            text: "7. In conflicts, you resolve with:",
            options: [
                { label: "Logical and direct arguments", value: "0" },
                { label: "Empathy and maintaining harmony", value: "1" }
            ]
        },
        {
            id: "jp2",
            text: "8. Your daily routine:",
            options: [
                { label: "You like lists and defined deadlines", value: "0" },
                { label: "You improvise and adapt in the moment", value: "1" }
            ]
        },
        {
            id: "ei3",
            text: "9. When dealing with new things:",
            options: [
                { label: "You prefer what is known and proven", value: "0" },
                { label: "You love exploring the new and unknown", value: "1" }
            ]
        },
        {
            id: "sn3",
            text: "10. Emotionally:",
            options: [
                { label: "You maintain distance and objectivity", value: "0" },
                { label: "You deeply engage with feelings", value: "1" }
            ]
        }
    ]

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        void (async () => {
            try {
                // Convert answers object to ordered array matching question order
                const answersArray = questions.map((q) => answers[q.id] || "")
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/anime/recommend`, { answers: answersArray })
                setRecommendations(response.data as AnimeType[])
            } catch (error) {
                console.error(error)
                setError("Failed to get recommendations. Please check your internet connection and make sure all questions are answered, then try again.")
            } finally {
                setLoading(false)
            }
        })()
    }

    return (
        <div className="min-h-screen px-6 py-10 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
            <div className="mx-auto max-w-3xl space-y-8">
                <header className="space-y-2">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Miso Soup</p>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Anime Recommender</h1>
                    <p className="text-gray-600 dark:text-gray-300">Answer the MBTI test and get anime recommendations tailored to your personality profile.</p>
                </header>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="space-y-6">
                        {questions.map((q) => (
                            <fieldset key={q.id} className="space-y-3">
                                <legend className="text-sm font-medium text-gray-900 dark:text-gray-100">{q.text}</legend>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {q.options.map((opt) => (
                                        <label
                                            key={opt.value}
                                            htmlFor={`${q.id}-${opt.value}`}
                                            className="block cursor-pointer rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-300 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:has-[:checked]:border-blue-400 dark:has-[:checked]:ring-blue-400"
                                        >
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={q.id}
                                                    value={opt.value}
                                                    id={`${q.id}-${opt.value}`}
                                                    className="size-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                    onChange={(e) =>
                                                        setAnswers({
                                                            ...answers,
                                                            [q.id]: e.target.value
                                                        })
                                                    }
                                                    required
                                                />
                                                <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:outline-blue-300"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Get Recommendations"}
                        </button>
                        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
                    </div>
                </form>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommendations</h2>
                    {recommendations.length === 0 && <p className="text-sm text-gray-600 dark:text-gray-400">No recommendations yet. Answer the questions to get started.</p>}
                    <div className="grid gap-3">
                        {recommendations.map((anime: AnimeType) => (
                            <div key={anime.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">{anime.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Genres: {anime.genres.join(", ")}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
