import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";

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
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 1 });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [rowsToSelect, setRowsToSelect] = useState<number>(0);
  const overlayRef = useRef<OverlayPanel>(null);

  const fetchArtworks = async (page: number) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${lazyParams.rows}`
      );
      setArtworks(res.data.data);
      setTotalRecords(res.data.pagination.total);
    } catch (err) {
      console.error("Error fetching artworks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(lazyParams.page);
  }, [lazyParams.page]);

  const onPageChange = (event: any) => {
    setLazyParams({
      ...lazyParams,
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    });
  };

  const onRowSelect = (rowData: Artwork) => {
    setSelectedIds(new Set(selectedIds.add(rowData.id)));
  };

  const onRowUnselect = (rowData: Artwork) => {
    const newSet = new Set(selectedIds);
    newSet.delete(rowData.id);
    setSelectedIds(newSet);
  };

  const handleSelectRows = () => {
    const newSet = new Set(selectedIds);
    const rowsToAdd = artworks.slice(0, rowsToSelect);
    rowsToAdd.forEach((r) => newSet.add(r.id));
    setSelectedIds(newSet);
    overlayRef.current?.hide();
  };

  const selection = artworks.filter((art) => selectedIds.has(art.id));

  return (
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-3">
        Data
        <Button
          icon="pi pi-chevron-down"
          className="p-button-text"
          onClick={(e) => overlayRef.current?.toggle(e)}
          tooltip="Custom Select"
        />
      </h2>

      <OverlayPanel ref={overlayRef}>
        <div className="flex flex-col gap-2 p-2">
          <label htmlFor="rows">Select rows:</label>
          <InputNumber
            id="rows"
            value={rowsToSelect}
            onValueChange={(e) => setRowsToSelect(e.value || 0)}
            showButtons
            min={0}
            max={lazyParams.rows}
          />
          <Button label="Submit" onClick={handleSelectRows} />
        </div>
      </OverlayPanel>

      <DataTable
        value={artworks}
        loading={loading}
        paginator
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        first={lazyParams.first}
        onPage={onPageChange}
        lazy
        dataKey="id"
        tableStyle={{ minWidth: "60rem" }}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        responsiveLayout="scroll"
        selection={selection}
        onRowSelect={(e) => onRowSelect(e.data)}
        onRowUnselect={(e) => onRowUnselect(e.data)}
        selectionMode="checkbox"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
        <Column field="title" header="Title" sortable style={{ width: "20%" }} />
        <Column field="place_of_origin" header="Place of Origin" style={{ width: "15%" }} />
        <Column field="artist_display" header="Artist" style={{ width: "20%" }} />
        <Column field="inscriptions" header="Inscriptions" style={{ width: "20%" }} />
        <Column field="date_start" header="Start Date" style={{ width: "10%" }} />
        <Column field="date_end" header="End Date" style={{ width: "10%" }} />
      </DataTable>
    </div>
  );
}

export default App;
