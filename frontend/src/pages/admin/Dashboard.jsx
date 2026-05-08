import { useEffect, useMemo, useState } from "react";
import DashboardCard from "../../components/DashboardCard.jsx";
import { fetchStores } from "../../services/stores.js";
import { fetchUsers } from "../../services/users.js";
import Skeleton from "../../components/Skeleton.jsx";

function RatingsChart({ distribution }) {
  const max = Math.max(...distribution.map((item) => item.count), 1);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Ratings distribution</h3>
        <span className="text-xs text-slate-400">last 90 days</span>
      </div>
      <div className="mt-6 space-y-4">
        {distribution.map((item) => (
          <div key={item.rating} className="flex items-center gap-4">
            <span className="text-xs text-slate-500 w-6">{item.rating}</span>
            <div className="flex-1 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${(item.count / max) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-400 w-8 text-right">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentList({ title, items }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">{item.primary}</p>
              <p className="text-xs text-slate-400">{item.secondary}</p>
            </div>
            <span className="text-xs text-slate-400">{item.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [storesData, usersData] = await Promise.all([fetchStores({}), fetchUsers()]);
        setStores(storesData);
        setUsers(usersData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRatings = useMemo(
    () => stores.reduce((sum, store) => sum + (store.totalRatings || 0), 0),
    [stores]
  );

  const distribution = useMemo(() => {
    const base = [1, 2, 3, 4, 5].map((rating) => ({ rating, count: 0 }));
    stores.forEach((store) => {
      if (!store.totalRatings) return;
      const bucket = Math.max(1, Math.min(5, Math.round(store.avgRating || 0)));
      const target = base.find((item) => item.rating === bucket);
      if (target) target.count += store.totalRatings;
    });
    return base;
  }, [stores]);

  const recentUsers = useMemo(
    () =>
      users.slice(0, 4).map((user) => ({
        id: user.id,
        primary: user.name,
        secondary: user.email,
        meta: user.role
      })),
    [users]
  );

  const recentStores = useMemo(
    () =>
      stores.slice(0, 4).map((store) => ({
        id: store.id,
        primary: store.name,
        secondary: store.address,
        meta: `${store.avgRating.toFixed(1)} avg`
      })),
    [stores]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          [1, 2, 3].map((item) => <Skeleton key={item} className="h-36" />)
        ) : (
          <>
            <DashboardCard label="Total users" value={users.length} />
            <DashboardCard label="Total stores" value={stores.length} />
            <DashboardCard label="Total ratings" value={totalRatings} />
          </>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {loading ? <Skeleton className="h-80" /> : <RatingsChart distribution={distribution} />}
        {loading ? <Skeleton className="h-80" /> : <RecentList title="Recent activity" items={[...recentUsers, ...recentStores]} />}
      </div>
    </div>
  );
}
