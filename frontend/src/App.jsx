import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Patients from "./pages/Patients";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";
import AppNavbar from "./components/AppNavbar";

// Korumalı Rota Bileşeni
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// Legacy Layout for older pages if needed
function LegacyLayout() {
  return (
    <div className="bg-light min-vh-100">
      <AppNavbar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute><Outlet /></PrivateRoute>}>
          {/* New Design Pages - Self-contained Layouts */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
