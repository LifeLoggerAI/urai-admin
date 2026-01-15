import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/client'

export type RenderJobPreset = 'life-movie-v1' | 'life-movie-v2' | 'life-movie-v3'

export async function createRenderJob(params: {
  userId: string
  preset: RenderJobPreset
  source?: 'admin'
}) {
  const ref = await addDoc(collection(db, 'renderJobs'), {
    userId: params.userId,
    preset: params.preset,
    source: params.source ?? 'admin',
    status: 'queued',
    progress: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}
