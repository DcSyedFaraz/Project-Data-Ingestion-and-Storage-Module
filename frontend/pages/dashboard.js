// Install before using:
//   npm install chart.js react-chartjs-2

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

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GlobalTempChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('/datasets/global_temp.json')
      .then(res => res.json())
      .then(raw => {
        // Assuming the JSON is an array of records like:
        // { timestamp: "1850-01-01T00:00:00Z", temperature: -0.6746, station_id: "GLOBAL" } :contentReference[oaicite:3]{index=3}
        const rows = raw.filter(r => r.station_id === 'GLOBAL');

        const labels = rows.map(r => new Date(r.timestamp));
        const values = rows.map(r => r.temperature);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Global Temp Anomaly (°C)',
              data: values,
              fill: false,
              tension: 0.1,
            },
          ],
        });
      })
      .catch(err => console.error('Error loading JSON:', err));
  }, []);

  if (!chartData) return <p>Loading chart…</p>;

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: { unit: 'year', tooltipFormat: 'MMM yyyy' },
        title: { display: true, text: 'Year' },
      },
      y: {
        title: { display: true, text: 'Anomaly (°C)' },
      },
    },
    plugins: {
      title: { display: true, text: 'Global Land+Ocean Temperature Anomalies' },
      tooltip: { mode: 'index', intersect: false },
    },
  };

  return <Line data={chartData} options={options} />;
}
