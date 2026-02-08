import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Departments from "./pages/Departments.jsx";
import Designations from "./pages/Designations.jsx";
import Employees from "./pages/Employees.jsx";
import Attendance from "./pages/Attendance.jsx";
import Leaves from "./pages/Leaves.jsx";

const navItems = [
  { path: "/", label: "ড্যাশবোর্ড" },
  { path: "/departments", label: "ডিপার্টমেন্ট" },
  { path: "/designations", label: "পদবী" },
  { path: "/employees", label: "কর্মী" },
  { path: "/attendance", label: "হাজিরা" },
  { path: "/leaves", label: "ছুটি" }
];

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>NU HRM</h1>
          <p>React + Supabase</p>
        </div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/designations" element={<Designations />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />
        </Routes>
      </main>
    </div>
  );
}
