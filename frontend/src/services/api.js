export const analyzeWithAI = async (domain, input) => {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, input }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};
