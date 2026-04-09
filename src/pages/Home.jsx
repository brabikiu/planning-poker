import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'

function Home() {
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

 async function createRoom() {
  console.log('click!')
  if (!name.trim()) return alert('Escribe tu nombre!')
  setLoading(true)
  try {
    console.log('creando sala...')
    const room = await addDoc(collection(db, 'rooms'), {
      createdAt: Date.now(),
      revealed: false,
      story: '',
      players: {}
    })
    console.log('sala creada:', room.id)
    navigate(`/room/${room.id}?name=${name}`)
  } catch (error) {
    console.error('Error:', error)
    alert('Error: ' + error.message)
  }
}

  async function joinRoom() {
    if (!name.trim()) return alert('Escribe tu nombre!')
    if (!roomCode.trim()) return alert('Escribe el código de sala!')
    setLoading(true)
    const ref = doc(db, 'rooms', roomCode.trim())
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      alert('Sala no encontrada!')
      setLoading(false)
      return
    }
    navigate(`/room/${roomCode.trim()}?name=${name}`)
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Planning Poker</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Estimación ágil para tu equipo</p>

      <label style={{ fontSize: 13, fontWeight: 500 }}>Tu nombre</label>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Ej: Ana"
        style={inputStyle}
      />

      <button onClick={createRoom} disabled={loading} style={btnPrimary}>
        {loading ? 'Creando...' : '+ Crear sala'}
      </button>

      <div style={{ textAlign: 'center', margin: '16px 0', color: '#999', fontSize: 13 }}>o únete a una existente</div>

      <input
        value={roomCode}
        onChange={e => setRoomCode(e.target.value)}
        placeholder="Código de sala"
        style={inputStyle}
      />
      <button onClick={joinRoom} disabled={loading} style={btnSecondary}>
        Entrar a sala
      </button>
    </div>
  )
}

const inputStyle = {
  display: 'block', width: '100%', padding: '10px 12px',
  border: '1px solid #ddd', borderRadius: 8, fontSize: 14,
  marginTop: 6, marginBottom: 16, boxSizing: 'border-box'
}
const btnPrimary = {
  width: '100%', padding: '11px', borderRadius: 8,
  background: '#378ADD', color: '#fff', border: 'none',
  fontSize: 14, fontWeight: 500, cursor: 'pointer'
}
const btnSecondary = {
  width: '100%', padding: '11px', borderRadius: 8,
  background: '#fff', color: '#378ADD', border: '1px solid #378ADD',
  fontSize: 14, fontWeight: 500, cursor: 'pointer'
}

export default Home