import { useState } from 'react';
import { getSession } from 'next-auth/react'

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) {
        return { redirect: { destination: '/api/auth/signin', permanent: false } }
    }
    return { props: { session } }
}

export default function Home() {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [prediction, setPrediction] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Private-Network': 'true', 'Access-Control-Allow-Expose-Headers': 'Content-Type' },
            body: JSON.stringify({ year: parseInt(year), month: parseInt(month) }),
        });
        const json = await res.json();
        setPrediction(json.predicted_avg_temp);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-xl font-bold mb-4">Temperature Predictor</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="number"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border p-2 w-full"
                />
                <input
                    type="number"
                    placeholder="Month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border p-2 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Predict
                </button>
            </form>
            {prediction !== null && (
                <div className="mt-6 p-4 bg-green-100 rounded">
                    Predicted Average Temperature: {prediction.toFixed(2)}
                </div>
            )}
        </div>
    );
}