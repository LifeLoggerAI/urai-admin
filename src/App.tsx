import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './lib/firebase/client'
import { listUsers, listFeatureFlags, setFeatureFlag, writeAudit } from './lib/firestore/admin'

type AnyRec = Record<string, any>

export default function App() {
  const [user, setUser] = useState<AnyRec | null>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<AnyRec[]>([])
  const [flags, setFlags] = useState<AnyRec[]>([])

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u as AnyRec | null)
      setLoading(false)
      if (u) {
        const [uList, fList] = await Promise.all([listUsers(), listFeatureFlags()])
        setUsers(uList)
        setFlags(fList)
        await writeAudit('ADMIN_LOGIN', u.email ?? undefined)
      }
    })
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>
  if (!user) return <Login />

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1 style={{ margin: 0 }}>URAI Admin</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>{String(user.email || '')}</p>

      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.id}</li>
        ))}
      </ul>

      <h2>Feature Flags</h2>
      <ul style={{ display: 'grid', gap: 8, paddingLeft: 16 }}>
        {flags.map((f) => (
          <li key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ minWidth: 280 }}>{f.id}: <b>{String(f.value)}</b></span>
            <button
              onClick={async () => {
                await setFeatureFlag(f.id, !Boolean(f.value))
                setFlags(await listFeatureFlags())
              }}
            >
              toggle
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Login() {
  const login = async () => {
    const email = prompt('Admin email')
    const password = prompt('Password')
    if (!email || !password) return
    await signInWithEmailAndPassword(auth, email, password)
  }
  return (
    <div style={{ padding: 24 }}>
      <h2>Sign in</h2>
      <button onClick={login}>Sign in</button>
    </div>
  )
}
