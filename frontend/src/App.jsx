import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminStores from "./pages/admin/Stores.jsx";
import AddStore from "./pages/admin/AddStore.jsx";
import AddUser from "./pages/admin/AddUser.jsx";
import Profile from "./pages/admin/Profile.jsx";
import UserDashboard from "./pages/user/Dashboard.jsx";
import OwnerDashboard from "./pages/owner/Dashboard.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}> 
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <AdminUsers />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <AdminStores />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/add-store"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <AddStore />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <AddUser />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <Profile />
              </RoleRoute>
            }
          />

          <Route
            path="/user"
            element={
              <RoleRoute roles={["USER"]}>
                <UserDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <RoleRoute roles={["OWNER"]}>
                <OwnerDashboard />
              </RoleRoute>
            }
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
