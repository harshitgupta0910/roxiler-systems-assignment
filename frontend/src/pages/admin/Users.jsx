import { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { fetchUsers } from "../../services/users.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import Skeleton from "../../components/Skeleton.jsx";

const PAGE_SIZE = 6;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers(debouncedQuery);
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedQuery]);

  const sorted = useMemo(() => {
    const clone = [...users];
    clone.sort((a, b) => {
      const aValue = a[sortKey] || "";
      const bValue = b[sortKey] || "";
      if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return clone;
  }, [users, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { key: "name", label: "Name", render: (row) => row.name },
    { key: "email", label: "Email", render: (row) => row.email },
    { key: "role", label: "Role", render: (row) => row.role },
    { key: "address", label: "Address", render: (row) => row.address || "—" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name, email, or address" />
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="createdAt">Newest</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>
          <button
            type="button"
            onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            {sortDir === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <>
          <Table columns={columns} data={paged} emptyMessage="No users found" />
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
