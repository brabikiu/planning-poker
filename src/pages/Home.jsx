import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, auth } from '../firebase'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

function Home({ user }) {
  const [roomCode, setRoomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function createRoom() {
    setLoading(true)
    try {
      const room = await addDoc(collection(db, 'rooms'), {
        createdAt: Date.now(),
        revealed: false,
        story: '',
        players: {},
        createdBy: user.uid
      })
      navigate(`/room/${room.id}`)
    } catch (e) {
      alert('Error: ' + e.message)
      setLoading(false)
    }
  }

  async function joinRoom() {
    if (!roomCode.trim()) return alert('Escribe el código de sala!')
    setLoading(true)
    try {
      const ref = doc(db, 'rooms', roomCode.trim())
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        alert('Sala no encontrada!')
        setLoading(false)
        return
      }
      navigate(`/room/${roomCode.trim()}`)
    } catch (e) {
      alert('Error: ' + e.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 1rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#3d2f8f' }}>🃏 Planning Poker</div>
            <div style={{ fontSize: 13, color: '#9b8ec4', marginTop: 2 }}>Hola, {user.displayName?.split(' ')[0]}!</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={user.photoURL} referrerPolicy="no-referrer" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #e0d9ff' }} />
            <button onClick={() => signOut(auth)} style={{ fontSize: 12, color: '#9b8ec4', background: 'none', border: 'none', cursor: 'pointer' }}>
              Salir
            </button>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1.5px solid #e0d9ff', borderRadius: 16, padding: '1.5rem', marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: '#9b8ec4', marginBottom: 12 }}>Nuevo sprint, nueva sesión</div>
          <button onClick={createRoom} disabled={loading} style={btnPrimary}>
            {loading ? 'Creando...' : '+ Crear sala nueva'}
          </button>
        </div>

        <div style={{ background: '#fff', border: '1.5px solid #e0d9ff', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ fontSize: 13, color: '#9b8ec4', marginBottom: 10 }}>Unirte a una sala existente</div>
          <input
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && joinRoom()}
            placeholder="Código de sala..."
            style={inputStyle}
          />
          <button onClick={joinRoom} disabled={loading} style={btnSecondary}>
            Entrar
          </button>
        </div>

      </div>
    </div>
  )
}

const inputStyle = {
  display: 'block', width: '100%', padding: '10px 12px',
  border: '1.5px solid #e0d9ff', borderRadius: 10, fontSize: 14,
  marginBottom: 10, boxSizing: 'border-box', background: '#f7f5ff',
  color: '#3d2f8f', outline: 'none', fontFamily: 'inherit'
}
const btnPrimary = {
  width: '100%', padding: '12px', borderRadius: 10,
  background: '#7F77DD', color: '#fff', border: 'none',
  fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'
}
const btnSecondary = {
  width: '100%', padding: '11px', borderRadius: 10,
  background: '#fff', color: '#7F77DD', border: '1.5px solid #7F77DD',
  fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'
}

export default Home