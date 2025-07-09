import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale)

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null))
  }, [])

  if (!data) return <p>Loading...</p>

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Avg Temp',
        data: data.values,
        fill: false,
        borderColor: 'rgb(75,192,192)'
      }
    ]
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Climate Dashboard</h1>
      <Line data={chartData} />
    </div>
  )
}
