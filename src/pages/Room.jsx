import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db, auth } from '../firebase'
import { doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import PokerCard from '../components/PokerCard'
import PlayerList from '../components/PlayerList'
import Results from '../components/Results'

const CARDS = ['0', '½', '1', '2', '3', '5', '8', '13', '21', '34', '?', '☕']

function Room({ user }) {
  const { roomId } = useParams()
  const playerName = user.displayName
  const playerPhoto = user.photoURL

  const [room, setRoom] = useState(null)
  const [myVote, setMyVote] = useState(null)
  const [story, setStory] = useState('')

  const roomRef = doc(db, 'rooms', roomId)

  useEffect(() => {
    updateDoc(roomRef, {
      [`players.${user.uid}`]: {
        name: playerName,
        photo: playerPhoto,
        vote: null
      }
    })

    const unsub = onSnapshot(roomRef, snap => {
      if (snap.exists()) {
        const data = snap.data()
        setRoom(data)
        setStory(data.story || '')
        setMyVote(data.players?.[user.uid]?.vote ?? null)
      }
    })

    return () => unsub()
  }, [roomId])

  async function vote(card) {
    const newVote = myVote === card ? null : card
    setMyVote(newVote)
    await updateDoc(roomRef, {
      [`players.${user.uid}.vote`]: newVote
    })
  }

  async function reveal() {
    await updateDoc(roomRef, { revealed: true })
  }

  async function newRound() {
    const updates = {}
    Object.keys(room.players).forEach(uid => {
      updates[`players.${uid}.vote`] = null
    })
    await updateDoc(roomRef, { ...updates, revealed: false, story })
    setMyVote(null)
  }

  async function updateStory() {
    await updateDoc(roomRef, { story })
  }

  if (!room) return (
    <div style={{ minHeight: '100vh', background: '#f7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9b8ec4' }}>
      Cargando sala...
    </div>
  )

  const players = room.players || {}
  const allVoted = Object.values(players).every(p => p?.vote !== null && p?.vote !== undefined)

  return (
    <div style={{ minHeight: '100vh', background: '#f7f5ff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem 1rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#3d2f8f' }}>🃏 Planning Poker</div>
            <div style={{ fontSize: 12, color: '#9b8ec4' }}>Sala: {roomId.slice(0, 8)}...</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={user.photoURL} referrerPolicy="no-referrer" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #e0d9ff' }} />
            <button onClick={() => signOut(auth)} style={{ fontSize: 12, color: '#9b8ec4', background: 'none', border: 'none', cursor: 'pointer' }}>
              Salir
            </button>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1.5px solid #e0d9ff', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#b0a0d8', marginBottom: 6 }}>User Story</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="Ej: Login con Google OAuth"
              style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #e0d9ff', borderRadius: 8, fontSize: 14, background: '#f7f5ff', color: '#3d2f8f', fontFamily: 'inherit', outline: 'none' }}
            />
            <button onClick={updateStory} style={{ padding: '9px 16px', borderRadius: 8, border: '1.5px solid #e0d9ff', background: '#fff', cursor: 'pointer', fontSize: 13, color: '#7F77DD', fontFamily: 'inherit' }}>
              Guardar
            </button>
          </div>
        </div>

        <PlayerList players={players} revealed={room.revealed} />

        {!room.revealed && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#9b8ec4', fontWeight: 500, marginBottom: 10 }}>Tu estimación</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CARDS.map(card => (
                <PokerCard key={card} value={card} selected={myVote === card} onClick={() => vote(card)} />
              ))}
            </div>
          </div>
        )}

        {room.revealed && <Results players={players} />}

        <div style={{ display: 'flex', gap: 10 }}>
          {!room.revealed && (
            <button onClick={reveal} disabled={!allVoted} style={{
              padding: '11px 24px', borderRadius: 10, border: 'none',
              background: allVoted ? '#7F77DD' : '#d0caf0',
              color: '#fff', fontSize: 14, fontWeight: 500,
              cursor: allVoted ? 'pointer' : 'not-allowed', fontFamily: 'inherit'
            }}>
              {allVoted ? 'Revelar votos' : 'Esperando jugadores...'}
            </button>
          )}
          <button onClick={newRound} style={{
            padding: '11px 24px', borderRadius: 10,
            border: '1.5px solid #e0d9ff', background: '#fff',
            cursor: 'pointer', fontSize: 14, color: '#7F77DD', fontFamily: 'inherit'
          }}>
            Nueva ronda
          </button>
        </div>

      </div>
    </div>
  )
}

export default Room