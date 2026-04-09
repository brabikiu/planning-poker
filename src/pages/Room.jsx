import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, updateDoc, onSnapshot } from 'firebase/firestore'
import PokerCard from '../components/PokerCard'
import PlayerList from '../components/PlayerList'
import Results from '../components/Results'

const CARDS = ['0', '½', '1', '2', '3', '5', '8', '13', '21', '34', '?', '☕']

function Room() {
  const { roomId } = useParams()
  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('name') || 'Anónimo'

  const [room, setRoom] = useState(null)
  const [myVote, setMyVote] = useState(null)
  const [story, setStory] = useState('')

  const roomRef = doc(db, 'rooms', roomId)

  useEffect(() => {
    // entrar a la sala
    updateDoc(roomRef, {
      [`players.${playerName}`]: null
    })

    // escuchar cambios en tiempo real
    const unsub = onSnapshot(roomRef, snap => {
      if (snap.exists()) {
        const data = snap.data()
        setRoom(data)
        setStory(data.story || '')
        setMyVote(data.players?.[playerName] ?? null)
      }
    })

    // salir de la sala al cerrar
    return () => {
      unsub()
      updateDoc(roomRef, {
        [`players.${playerName}`]: null
      })
    }
  }, [roomId])

  async function vote(card) {
    const newVote = myVote === card ? null : card
    setMyVote(newVote)
    await updateDoc(roomRef, {
      [`players.${playerName}`]: newVote
    })
  }

  async function reveal() {
    await updateDoc(roomRef, { revealed: true })
  }

  async function newRound() {
    const resetPlayers = {}
    Object.keys(room.players).forEach(p => resetPlayers[`players.${p}`] = null)
    await updateDoc(roomRef, {
      ...resetPlayers,
      revealed: false,
      story: story
    })
    setMyVote(null)
  }

  async function updateStory() {
    await updateDoc(roomRef, { story })
  }

  if (!room) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando sala...</div>

  const players = room.players || {}
  const allVoted = Object.values(players).every(v => v !== null)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Planning Poker</h1>
        <span style={{ fontSize: 12, background: '#f0f0f0', padding: '4px 10px', borderRadius: 20 }}>
          Sala: {roomId.slice(0, 6)}...
        </span>
      </div>

      {/* Story */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 500 }}>User Story</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <input
            value={story}
            onChange={e => setStory(e.target.value)}
            placeholder="Ej: Login con Google OAuth"
            style={{ flex: 1, padding: '9px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}
          />
          <button onClick={updateStory} style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
            Guardar
          </button>
        </div>
      </div>

      {/* Jugadores */}
      <PlayerList players={players} revealed={room.revealed} />

      {/* Cartas */}
      {!room.revealed && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Tu estimación</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {CARDS.map(card => (
              <PokerCard
                key={card}
                value={card}
                selected={myVote === card}
                onClick={() => vote(card)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Resultados */}
      {room.revealed && <Results players={players} />}

      {/* Acciones */}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {!room.revealed && (
          <button
            onClick={reveal}
            disabled={!allVoted}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: allVoted ? '#378ADD' : '#ccc',
              color: '#fff', fontSize: 14, fontWeight: 500,
              cursor: allVoted ? 'pointer' : 'not-allowed'
            }}
          >
            {allVoted ? 'Revelar votos' : 'Esperando jugadores...'}
          </button>
        )}
        <button onClick={newRound} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14 }}>
          Nueva ronda
        </button>
      </div>

    </div>
  )
}

export default Room