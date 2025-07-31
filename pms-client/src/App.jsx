import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardWithPaginationEnhance from './pages/DashboardWithPaginationEnhance';
import Parcels from './pages/Parcels';
import EditParcel from './pages/EditParcel';
import TrackingEnhence from './pages/TrackingEnhence';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ParcelDetails from './pages/ParcelDetails';
import AddParcelEnhance from './pages/AddParcelEnhance';
import ReportSummaryEnhance from './components/ReportSummaryEnhance';


function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<DashboardWithPaginationEnhance />} />
              <Route path="/parcels" element={<Parcels />} />
              <Route path="/add-parcel" element={<AddParcelEnhance />} />
              <Route path="/edit-parcel/:id" element={<EditParcel />} />
              <Route path="/tracking" element={<TrackingEnhence />} />
              <Route path="/view-details/:id" element={<ParcelDetails />} />
              <Route path="/reports" element={<ReportSummaryEnhance />} />
              {/* <Route path="/reports" element={<ReportSummary />} /> */}
              {/* <Route path="/reports" element={<ReportPage />} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;