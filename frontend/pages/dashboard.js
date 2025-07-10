import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import Layout from '../components/Layout';
import { getSession } from 'next-auth/react';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return { redirect: { destination: '/api/auth/signin', permanent: false } }
  }
  return { props: { session } }
}

export default function GlobalTempChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    avgTemp: 0,
    maxTemp: 0,
    minTemp: 0,
    dataPoints: 0
  });

  useEffect(() => {
    // Simulate loading data - replace with actual fetch
    const simulateDataLoad = () => {
      try {
        // Generate sample data for demonstration
        const startYear = 1850;
        const endYear = 2023;
        const rows = [];

        for (let year = startYear; year <= endYear; year++) {
          for (let month = 1; month <= 12; month++) {
            const baseTemp = -0.2 + (year - 1850) * 0.006; // Simulate warming trend
            const seasonalVariation = Math.sin((month - 1) * Math.PI / 6) * 0.3;
            const randomVariation = (Math.random() - 0.5) * 0.8;
            const temperature = baseTemp + seasonalVariation + randomVariation;

            rows.push({
              timestamp: new Date(year, month - 1, 1),
              temperature: temperature,
              station_id: 'GLOBAL'
            });
          }
        }

        const labels = rows.map(r => r.timestamp);
        const values = rows.map(r => r.temperature);

        // Calculate statistics
        const avgTemp = values.reduce((sum, val) => sum + val, 0) / values.length;
        const maxTemp = Math.max(...values);
        const minTemp = Math.min(...values);

        setStats({
          avgTemp: avgTemp,
          maxTemp: maxTemp,
          minTemp: minTemp,
          dataPoints: values.length
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Global Temperature Anomaly (°C)',
              data: values,
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.1,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointBackgroundColor: 'rgb(239, 68, 68)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load temperature data');
        setLoading(false);
      }
    };

    // Simulate API call delay
    setTimeout(simulateDataLoad, 1000);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 },
          color: '#374151',
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Global Land+Ocean Temperature Anomalies (1850-2023)',
        font: { size: 18, weight: 'bold' },
        color: '#1f2937',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function (context) {
            return new Date(context[0].parsed.x).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short'
            });
          },
          label: function (context) {
            return `Anomaly: ${context.parsed.y.toFixed(3)}°C`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'year',
          displayFormats: {
            year: 'yyyy'
          }
        },
        title: {
          display: true,
          text: 'Year',
          font: { size: 14 },
          color: '#374151'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temperature Anomaly (°C)',
          font: { size: 14 },
          color: '#374151'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
    },
  };

  if (loading) {
    return (
      <Layout title="Dashboard - TempPredict">

        <div className="max-w-6xl mx-auto p-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌍 Global Temperature Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore historical global temperature anomalies and climate trends over time.
            </p>
          </div>

          {/* Loading State */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600 text-lg">Loading global temperature data...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard - TempPredict">

        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Home - TempPredict">

      <div className="max-w-6xl mx-auto p-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌍 Global Temperature Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore historical global temperature anomalies and climate trends over time.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Anomaly</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgTemp.toFixed(3)}°C</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Maximum Anomaly</p>
                <p className="text-2xl font-bold text-red-600">{stats.maxTemp.toFixed(3)}°C</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-2xl">❄️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Minimum Anomaly</p>
                <p className="text-2xl font-bold text-blue-600">{stats.minTemp.toFixed(3)}°C</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data Points</p>
                <p className="text-2xl font-bold text-green-600">{stats.dataPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Temperature Anomaly Timeline</h2>
            <p className="text-red-100 mt-2">Historical global land and ocean temperature deviations from baseline</p>
          </div>

          {/* Chart Container */}
          <div className="p-8">
            <div className="h-96 md:h-[500px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🌡️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Temperature Anomalies</h3>
            <p className="text-gray-600">Deviations from the 20th century average global temperature, showing warming trends over time</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🌊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Land+Ocean Data</h3>
            <p className="text-gray-600">Combined temperature measurements from land stations and ocean buoys for comprehensive coverage</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Historical Timeline</h3>
            <p className="text-gray-600">Data spanning from 1850 to present, providing long-term climate perspective</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}