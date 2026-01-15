import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/client'

export async function listMovies() {
  const snap = await getDocs(collection(db, 'movies'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function retryRender(movieId: string) {
  await updateDoc(doc(db, 'movies', movieId), {
    status: 'RENDER_QUEUED',
    updatedAt: new Date()
  })
}
