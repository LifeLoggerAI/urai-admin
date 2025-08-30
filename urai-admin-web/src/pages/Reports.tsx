
import React from 'react';
import Nav from '../components/Nav';
import { app } from '../firebase';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';


export default function Reports(){
  const db = React.useMemo(()=>getFirestore(app),[]);
  const [rows,setRows] = React.useState<any[]>([]);
  async function load(){
    const snap = await getDocs(collection(db,'contentReports'));
    setRows(snap.docs.map(d=>({ id:d.id, ...d.data() })));
  }
  React.useEffect(()=>{ load(); },[]);
  async function resolve(id:string){ await updateDoc(doc(db,'contentReports',id), { status:'resolved', updatedAt: Date.now() }); await load(); }
  return (
    <div>
      <Nav/>
      <h1>Reports</h1>
      {rows.map(r=> (
        <div key={r.id} style={{border:'1px solid #eee',padding:12,margin:'12px 0'}}>
          <div><b>Type:</b> {r.type} <b>Status:</b> {r.status}</div>
          <div><b>Reason:</b> {r.reason} <b>Severity:</b> {r.severity}</div>
          <button onClick={()=>resolve(r.id)} disabled={r.status==='resolved'}>Resolve</button>
        </div>
      ))}
    </div>
  );
    }
