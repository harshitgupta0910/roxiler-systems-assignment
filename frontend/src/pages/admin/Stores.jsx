import { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { fetchStores } from "../../services/stores.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import Skeleton from "../../components/Skeleton.jsx";

const PAGE_SIZE = 6;

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [address, setAddress] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query);
  const debouncedAddress = useDebounce(address);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchStores({ query: debouncedQuery, address: debouncedAddress });
        setStores(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedQuery, debouncedAddress]);

  const sorted = useMemo(() => {
    const clone = [...stores];
    clone.sort((a, b) => {
      const aValue = a[sortKey] || 0;
      const bValue = b[sortKey] || 0;
      if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return clone;
  }, [stores, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { key: "name", label: "Store", render: (row) => row.name },
    { key: "address", label: "Address", render: (row) => row.address },
    { key: "owner", label: "Owner", render: (row) => row.owner?.name || "—" },
    { key: "avgRating", label: "Avg Rating", render: (row) => row.avgRating.toFixed(1) },
    { key: "totalRatings", label: "Total Ratings", render: (row) => row.totalRatings }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by store name" />
        <SearchBar value={address} onChange={setAddress} placeholder="Search by address" />
      </div>
      <div className="flex items-center justify-end gap-3 text-sm text-slate-600">
        <select
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2"
        >
          <option value="createdAt">Newest</option>
          <option value="name">Name</option>
          <option value="avgRating">Avg rating</option>
          <option value="totalRatings">Total ratings</option>
        </select>
        <button
          type="button"
          onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2"
        >
          {sortDir === "asc" ? "Asc" : "Desc"}
        </button>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <>
          <Table columns={columns} data={paged} emptyMessage="No stores found" />
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
