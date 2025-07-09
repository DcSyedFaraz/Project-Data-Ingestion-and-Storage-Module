export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  try {
    const backend = process.env.MODEL_URL || 'http://localhost:8000/predict_year';
    const resp = await fetch(backend, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(resp.ok ? 200 : 500).json(data);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch predictions' });
  }
}
