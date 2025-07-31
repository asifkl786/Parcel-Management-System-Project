import { useState } from 'react';
import { useLocation,Link } from 'react-router-dom';
import { getParcelByTrackingNumber } from '../services/parcelService';

const Tracking = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTrackingNumber = queryParams.get('number') || '';
  
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingNumber) {
      setError('Please enter a tracking number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await getParcelByTrackingNumber(trackingNumber);
      setParcel(data);
    } catch (err) {
      setError('Parcel not found. Please check the tracking number.');
      setParcel(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Track Parcel</h2>     
      <form onSubmit={handleTrack} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {parcel && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium mb-4">Parcel Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tracking Number</p>
              <p className="font-medium">{parcel.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">
                {parcel.status.toLowerCase().replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sender</p>
              <p className="font-medium">{parcel.senderName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Recipient</p>
              <p className="font-medium">{parcel.recipientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Received At</p>
              <p className="font-medium">
                {new Date(parcel.receivedAt).toLocaleString()}
              </p>
            </div>
            {parcel.deliveredAt && (
              <div>
                <p className="text-sm text-gray-500">Delivered At</p>
                <p className="font-medium">
                  {new Date(parcel.deliveredAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;