import { useEffect, useState } from 'react'

export default function Models() {
  const [models, setModels] = useState(null)

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data.models))
      .catch(err => console.error('Error loading models:', err))
  }, [])

  if (!models) return <p>Loading models…</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Trained Models</h1>
      <ul className="list-disc pl-4">
        {models.map(m => (
          <li key={m.name}>
            <strong>{m.name}</strong>
            <ul className="list-disc pl-6">
              {m.files.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
