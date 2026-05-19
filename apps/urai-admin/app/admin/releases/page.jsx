var gates = [
  ['Clean install', 'blocked', 'Run pnpm install from clean checkout'],
  ['Typecheck', 'blocked', 'Run pnpm check:types'],
  ['Lint', 'blocked', 'Run pnpm lint'],
  ['Unit tests', 'blocked', 'Run pnpm test:unit'],
  ['Rules tests', 'blocked', 'Run pnpm test:rules and emulator suite'],
  ['E2E tests', 'blocked', 'Run pnpm test:e2e'],
  ['Smoke tests', 'blocked', 'Run pnpm test:smoke against staging/live URL'],
  ['Build', 'blocked', 'Run pnpm build'],
  ['Release verifier', 'blocked', 'Run pnpm verify:release'],
  ['Staging deploy', 'blocked', 'Record Firebase preview evidence'],
  ['Owner approval', 'blocked', 'Record owner signoff in FINAL_LOCK.md'],
];

export var metadata = {
  title: 'URAI Admin Releases',
  description: 'Release readiness and production-lock evidence.',
};

export default function ReleasesPage() {
  return (
    <main>
      <h1>Release Readiness</h1>
      <p>Production readiness remains blocked until every gate is backed by evidence in FINAL_LOCK.md and docs/EVIDENCE_LOG.md.</p>
      <table>
        <thead>
          <tr>
            <th>Gate</th>
            <th>Status</th>
            <th>Evidence required</th>
          </tr>
        </thead>
        <tbody>
          {gates.map(function (gate) {
            return (
              <tr key={gate[0]}>
                <td>{gate[0]}</td>
                <td>{gate[1]}</td>
                <td>{gate[2]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
