import { useEffect, useState } from 'react';
import { getParcels } from '../services/parcelService';
import DashboardCards from '../components/DashboardCards';
//import ParcelList from '../components/ParcelList';
import ParcelListEnhence from '../components/ParcelListEnhence';


const Dashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const data = await getParcels();
        setParcels(data);
      } catch (error) {
        console.error('Error fetching parcels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, []);

  const recentParcels = parcels.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Parcel Management Dashboard</h1>
      
      <DashboardCards parcels={parcels} />
      
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium mb-4">Recent Parcels</h2>
        {loading ? (
          <p>Loading parcels...</p>
        ) : (
         // <ParcelList parcels={recentParcels} />
            <ParcelListEnhence parcels={recentParcels} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;