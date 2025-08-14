import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import DashboardWithPaginationEnhance from './pages/DashboardWithPaginationEnhance';
import Parcels from './pages/Parcels';
import EditParcel from './pages/EditParcel';
import TrackingEnhence from './pages/TrackingEnhence';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ParcelDetails from './pages/ParcelDetails';
import AddParcelEnhance from './pages/AddParcelEnhance';
import ReportSummaryEnhance from './components/ReportSummaryEnhance';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SettingsPage from './pages/SettingsPage';
import Home from './pages/Home';

function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet /> {/* ✅ This is where child routes will be rendered */}
          <ToastContainer />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* Protected Routes with layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardWithPaginationEnhance />} />
          <Route path="/parcels" element={<Parcels />} />
          <Route path="/add-parcel" element={<AddParcelEnhance />} />
          <Route path="/edit-parcel/:id" element={<EditParcel />} />
          <Route path="/tracking" element={<TrackingEnhence />} />
          <Route path="/view-details/:id" element={<ParcelDetails />} />
          <Route path="/reports" element={<ReportSummaryEnhance />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

