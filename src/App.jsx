import { useEffect, useState } from 'react';
import { fetchProjects } from './api';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Your Name</h1>
      <p>Java Full Stack Developer | Spring Boot • React</p>

      <h2>Projects</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <strong>{p.name}</strong> — {p.description}
          </li>
        ))}
      </ul>
    </main>
  );
}
