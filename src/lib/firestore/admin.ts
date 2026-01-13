import { collection, getDocs, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore'
import { db } from '../firebase/client'

export async function listUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function listFeatureFlags() {
  const snap = await getDocs(collection(db, 'featureFlags'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function setFeatureFlag(key: string, value: boolean) {
  await setDoc(
    doc(db, 'featureFlags', key),
    { value, updatedAt: serverTimestamp() },
    { merge: true }
  )
}

export async function writeAudit(action: string, actorEmail?: string) {
  await addDoc(collection(db, 'auditLogs'), {
    action,
    actorEmail: actorEmail ?? null,
    createdAt: serverTimestamp(),
  })
}
