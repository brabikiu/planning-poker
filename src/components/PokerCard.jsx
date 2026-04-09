function PokerCard({ value, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 64, height: 88, borderRadius: 10,
        border: selected ? '2px solid #378ADD' : '1.5px solid #ddd',
        background: selected ? '#EBF4FF' : '#fff',
        color: selected ? '#378ADD' : '#333',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 500, cursor: 'pointer',
        transform: selected ? 'translateY(-8px)' : 'none',
        transition: 'all 0.15s'
      }}
    >
      {value}
    </div>
  )
}

export default PokerCard