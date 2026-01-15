import React from 'react';
import Nav from '../components/Nav';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { app } from '../firebase';


export default function Flags(){
  const db = React.useMemo(()=>getFirestore(app),[]);
  const [rows,setRows] = React.useState<any[]>([]);
  React.useEffect(()=>{ (async()=>{
    const snap = await getDocs(collection(db,'featureFlags'));
    setRows(snap.docs.map(d=>({ id:d.id, ...d.data() })));
  })(); },[]);


  async function toggleKill(){
    await setDoc(doc(db,'featureFlags','kill_switch'), { key:'kill_switch', value: !(rows.find(r=>r.id==='kill_switch')?.value), type:'bool', env:['staging','prod'], rollout:{pct:0}, updatedAt: Date.now() });
  }


  return (
    <div>
      <Nav/>
      <h1>Feature Flags</h1>
      <button onClick={toggleKill}>Toggle Kill Switch</button>
      <pre>{JSON.stringify(rows,null,2)}</pre>
    </div>
  );
}