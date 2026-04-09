function PlayerList({ players, revealed }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Jugadores</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {Object.entries(players).map(([name, vote]) => (
          <div key={name} style={{
            background: '#fff', border: '1px solid #eee',
            borderRadius: 12, padding: '12px 16px', textAlign: 'center', minWidth: 90
          }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{name}</div>
            <div style={{
              width: 40, height: 54, borderRadius: 6, margin: '0 auto',
              background: vote ? (revealed ? '#EBF4FF' : '#f0f0f0') : '#fafafa',
              border: '1px solid #ddd',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: revealed ? 18 : 13, fontWeight: 500,
              color: revealed ? '#378ADD' : '#999'
            }}>
              {revealed ? (vote || '—') : (vote ? '✓' : '...')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayerList