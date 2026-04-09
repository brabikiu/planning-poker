import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Home from './pages/Home'
import Room from './pages/Room'
import Login from './components/Login'

function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return () => unsub()
  }, [])

  if (user === undefined) return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f5ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9b8ec4',
      fontSize: 14
    }}>
      Cargando...
    </div>
  )

  if (!user) return <Login />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/room/:roomId" element={<Room user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App