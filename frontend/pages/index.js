// pages/index.js
import { useState } from 'react';
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { getSession } from 'next-auth/react'
import Layout from '../components/Layout'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

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
    const [chartData, setChartData] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year: parseInt(year), month: parseInt(month) }),
            });
            const json = await res.json();
            setPrediction(json.predicted_avg_temp);
        } catch (error) {
            console.error('Prediction error:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadChart = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/predict_year', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year: parseInt(year) }),
            })
            const json = await res.json()
            if (res.ok) {
                setChartData({
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: `Predicted Temperature ${year}`,
                            data: json.predictions,
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgb(59, 130, 246)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                        },
                    ],
                })
            }
        } catch (error) {
            console.error('Chart loading error:', error);
        } finally {
            setLoading(false);
        }
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 14 },
                    color: '#374151'
                }
            },
            title: {
                display: true,
                text: `Monthly Temperature Predictions for ${year}`,
                font: { size: 16, weight: 'bold' },
                color: '#1f2937'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                    font: { size: 14 }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month',
                    font: { size: 14 }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    }

    return (
        <Layout title="Home - TempPredict">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        🌡️ Temperature Prediction System
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Harness the power of AI to predict future temperature patterns with precision and confidence.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white">Make Your Prediction</h2>
                        <p className="text-blue-100 mt-2">Enter a year and month to get AI-powered temperature forecasts</p>
                    </div>

                    {/* Card Body */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                                        Year
                                    </label>
                                    <input
                                        id="year"
                                        type="number"
                                        placeholder="e.g., 2025"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        min="1920"
                                        max="3100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                                        Month
                                    </label>
                                    <select
                                        id="month"
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    >
                                        <option value="">Select month</option>
                                        {[
                                            'January', 'February', 'March', 'April', 'May', 'June',
                                            'July', 'August', 'September', 'October', 'November', 'December'
                                        ].map((monthName, index) => (
                                            <option key={index} value={index + 1}>{monthName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Predicting...
                                        </span>
                                    ) : (
                                        '🎯 Get Prediction'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={loadChart}
                                    disabled={loading || !year}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? 'Loading...' : '📊 View Year Chart'}
                                </button>
                            </div>
                        </form>

                        {/* Prediction Result */}
                        {prediction !== null && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🌡️</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-800">Prediction Result</h3>
                                        <p className="text-3xl font-bold text-green-600">
                                            {prediction.toFixed(2)}°C
                                        </p>
                                        <p className="text-sm text-green-700 mt-1">
                                            Predicted average temperature for {month}/{year}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chart */}
                        {chartData && (
                            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="h-96">
                                    <Line data={chartData} options={chartOptions} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
                        <p className="text-gray-600">Advanced machine learning algorithms trained on historical climate data</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time</h3>
                        <p className="text-gray-600">Get instant predictions with our optimized prediction engine</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Analytics</h3>
                        <p className="text-gray-600">Interactive charts and visualizations for better insights</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}