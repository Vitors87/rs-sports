export default function ApiHome() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>rs-sports API</h1>
      <p style={{ color: '#666' }}>API service running on port 3001</p>
      <h2>Endpoints disponibles</h2>
      <ul>
        <li>
          <code>GET /api/health</code>
        </li>
      </ul>
    </main>
  );
}
