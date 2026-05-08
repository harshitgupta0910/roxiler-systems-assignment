import { useEffect, useMemo, useState } from "react";
import { fetchStores } from "../../services/stores.js";
import SearchBar from "../../components/SearchBar.jsx";
import RatingStars from "../../components/RatingStars.jsx";
import toast from "react-hot-toast";
import { createRating, updateRating } from "../../services/ratings.js";
import Skeleton from "../../components/Skeleton.jsx";
import EmptyState from "../../components/EmptyState.jsx";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [address, setAddress] = useState("");
  const [pending, setPending] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchStores({ query, address });
        setStores(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query, address]);

  const storeList = useMemo(() => stores, [stores]);

  const handleRatingChange = (storeId, rating) => {
    setPending((prev) => ({ ...prev, [storeId]: rating }));
  };

  const handleSubmit = async (store) => {
    const ratingValue = pending[store.id] ?? store.userRating;
    if (!ratingValue) {
      toast.error("Select a rating first");
      return;
    }

    if (store.userRating && store.userRating !== ratingValue) {
      const confirmUpdate = window.confirm("Update your existing rating?");
      if (!confirmUpdate) return;
    }

    const optimistic = stores.map((item) =>
      item.id === store.id
        ? { ...item, userRating: ratingValue, userRatingId: item.userRatingId || "optimistic" }
        : item
    );
    setStores(optimistic);

    try {
      if (store.userRatingId) {
        await updateRating(store.userRatingId, { rating: ratingValue });
      } else {
        const created = await createRating({ storeId: store.id, rating: ratingValue });
        setStores((prev) =>
          prev.map((item) => (item.id === store.id ? { ...item, userRatingId: created.id } : item))
        );
      }
      toast.success("Rating saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save rating");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by store name" />
        <SearchBar value={address} onChange={setAddress} placeholder="Search by address" />
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : storeList.length === 0 ? (
        <EmptyState title="No stores found" description="Try a different search or check back later." />
      ) : (
        <div className="grid gap-4">
          {storeList.map((store) => (
            <div key={store.id} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{store.name}</h3>
                  <p className="text-sm text-slate-500">{store.address}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Average rating: {store.avgRating.toFixed(1)} · {store.totalRatings} total
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3">
                  <RatingStars
                    value={pending[store.id] ?? store.userRating ?? 0}
                    onChange={(value) => handleRatingChange(store.id, value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleSubmit(store)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
                  >
                    {store.userRating ? "Update rating" : "Submit rating"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
