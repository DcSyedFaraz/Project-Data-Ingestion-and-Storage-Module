export default async function handler(req, res) {
  try {
    const backend = process.env.BACKEND_URL || 'http://localhost:5000/models'
    const resp = await fetch(backend)
    if (!resp.ok) throw new Error('backend error')
    const data = await resp.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'failed to load models' })
  }
}
