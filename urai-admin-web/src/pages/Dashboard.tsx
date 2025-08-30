
import Nav from '../components/Nav';
export default function Dashboard(){
  return (
    <div>
      <Nav/>
      <h1>URAI Admin</h1>
      <ul>
        <li>App Check: enforced</li>
        <li>Flags synced: see /flags</li>
        <li>DSR queue: see /dsr</li>
      </ul>
    </div>
  );
}
