function Results({ players }) {
  const votes = Object.values(players).filter(v => v && !isNaN(parseFloat(v)))
  const nums = votes.map(v => parseFloat(v))

  const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : null
  const min = nums.length ? Math.min(...nums) : null
  const max = nums.length ? Math.max(...nums) : null
  const consensus = nums.length > 0 && nums.every(n => n === nums[0])

  return (
    <div style={{ background: '#f8f8f8', borderRadius: 12, padding: '1.25rem', marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Resultado</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
        {[['Promedio', avg], ['Mínimo', min], ['Máximo', max]].map(([label, val]) => (
          <div key={label} style={{ background: '#fff', borderRadius: 8, padding: '10px', textAlign: 'center', border: '1px solid #eee' }}>
            <div style={{ fontSize: 22, fontWeight: 500 }}>{val ?? '—'}</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
        background: consensus ? '#eafaf1' : '#fff8e1',
        color: consensus ? '#1a7a4a' : '#b07800'
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
        {consensus ? 'Consenso total!' : 'Hay divergencia — discutir antes de votar de nuevo'}
      </div>
    </div>
  )
}

export default Results