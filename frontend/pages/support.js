import { useState } from 'react'

export default function Support() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch('http://localhost:5000/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    setStatus(res.ok ? 'Submitted' : 'Error')
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Support</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="border w-full p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
      {status && <p className="mt-2">{status}</p>}
    </div>
  )
}
