import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


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

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;


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
      <div className="card">
            <DataTable value={artworks} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                <Column field="title" header="Title" style={{ width: '25%' }}></Column>
                <Column field="place_of_origin" header="Place of Origin" style={{ width: '25%' }}></Column>
                <Column field="artist_display" header="Artist" style={{ width: '25%' }}></Column>
                <Column field="representative.name" header="Representative" style={{ width: '25%' }}></Column>
            </DataTable>
        </div>

    </div>
  );
}

export default App;
