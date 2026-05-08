import { useEffect, useMemo, useState } from "react";
import DashboardCard from "../../components/DashboardCard.jsx";
import Table from "../../components/Table.jsx";
import { fetchStores } from "../../services/stores.js";
import { fetchRatingsByStore } from "../../services/ratings.js";
import { useAuth } from "../../hooks/useAuth.js";
import Skeleton from "../../components/Skeleton.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatDate } from "../../utils/format.js";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const stores = await fetchStores({});
        const owned = stores.find((item) => item.owner?.id === user?.id);
        setStore(owned || null);
        if (owned) {
          const ratingsData = await fetchRatingsByStore(owned.id);
          setRatings(ratingsData);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const totals = useMemo(() => {
    if (!store) {
      return { avg: 0, reviewers: 0 };
    }
    const avg = store.avgRating || 0;
    return { avg, reviewers: store.totalRatings || 0 };
  }, [store]);

  const columns = [
    { key: "user", label: "User", render: (row) => row.user.name },
    { key: "email", label: "Email", render: (row) => row.user.email },
    { key: "rating", label: "Rating", render: (row) => row.rating },
    { key: "createdAt", label: "Submitted", render: (row) => formatDate(row.createdAt) }
  ];

  if (loading) {
    return <Skeleton className="h-64" />;
  }

  if (!store) {
    return <EmptyState title="No store assigned" description="Contact your admin to link your account with a store." />;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard label="Store" value={store.name} />
        <DashboardCard label="Average rating" value={totals.avg.toFixed(1)} />
        <DashboardCard label="Total reviewers" value={totals.reviewers} />
      </div>

      <Table columns={columns} data={ratings} emptyMessage="No ratings yet" />
    </div>
  );
}
