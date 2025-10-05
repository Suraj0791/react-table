import { useEffect, useState } from "react";
import axios from "axios";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://api.artic.edu/api/v1/artworks?page=1");
        setArtworks(res.data.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch artworks");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) return <p>Loading artworks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1> Artworks Table</h1>

      <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#f4f4f4" }}>
          <tr>
            <th>Title</th>
            <th>Place of Origin</th>
            <th>Artist</th>
            <th>Inscriptions</th>
            <th>Date Start</th>
            <th>Date End</th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((art) => (
            <tr key={art.id}>
              <td>{art.title || "—"}</td>
              <td>{art.place_of_origin || "—"}</td>
              <td>{art.artist_display || "—"}</td>
              <td>{art.inscriptions || "—"}</td>
              <td>{art.date_start || "—"}</td>
              <td>{art.date_end || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
