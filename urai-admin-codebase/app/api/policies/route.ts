import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

export async function GET() {
  const querySnapshot = await getDocs(collection(db, 'policies'));
  const policies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(policies);
}

export async function POST(req: NextRequest) {
  const policy = await req.json();
  const docRef = await addDoc(collection(db, 'policies'), policy);
  return NextResponse.json({ id: docRef.id, ...policy }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const updatedPolicy = await req.json();
  const { id, ...data } = updatedPolicy;
  const docRef = doc(db, 'policies', id);
  await updateDoc(docRef, data);
  const docSnap = await getDoc(docRef);
  return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteDoc(doc(db, 'policies', id));
  return new NextResponse(null, { status: 204 });
}
