
import React from 'react';
import Nav from '../components/Nav';
import { call } from '../firebase';


export default function DSR(){
  const request = React.useMemo(()=>call('admin_requestDSR'),[]);
  const [userId,setUserId] = React.useState('');
  const [type,setType] = React.useState<'export'|'delete'>('export');
  const [result,setResult] = React.useState<any>(null);
  async function submit(){ const res:any = await request({ userId, type }); setResult(res.data); }
  return (
    <div>
      <Nav/>
      <h1>DSR</h1>
      <input placeholder="userId" value={userId} onChange={e=>setUserId(e.target.value)} />
      <select value={type} onChange={e=>setType(e.target.value as any)}>
        <option value="export">export</option>
        <option value="delete">delete</option>
      </select>
      <button onClick={submit}>Queue</button>
      {result && <pre>{JSON.stringify(result,null,2)}</pre>}
    </div>
  );
}
