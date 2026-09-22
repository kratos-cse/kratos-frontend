export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>KRATOS&apos;26</h1>
      <p>UI cleared for redesign. Backend API wiring is intact.</p>
      <ul>
        <li>
          Proxy: <code>/api/v1/*</code> → <code>API_BASE_URL</code>
        </li>
        <li>
          Config: <code>GET /api/config</code> (Google client id)
        </li>
        <li>
          Client: <code>lib/api/*</code> + <code>AuthProvider</code>
        </li>
      </ul>
    </main>
  );
}
