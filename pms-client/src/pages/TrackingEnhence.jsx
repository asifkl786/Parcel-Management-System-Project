import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getParcelByTrackingNumber } from '../services/parcelService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Import an icon for the back button

const TrackingEnhence = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleCancel = () => {
    setTrackingNumber('');
    setParcel(null);
    setError('');
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      {/* Back button at the top */}
      <button
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 cursor-pointer"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back
      </button>
      
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
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-progress"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
          {/* Cancel button appears when there's input or results */}
          {(trackingNumber || parcel) && (
            <button
              type="button"
              onClick={handleCancel}
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {parcel && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Parcel Details</h3>
            {/* Close button for parcel details */}
            <button
              onClick={() => setParcel(null)}
             // className="text-gray-500 hover:text-gray-900 cursor-pointer"
              className='text-indigo-600 hover:text-indigo-950 cursor-pointer'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
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
          {/* Additional back button at the bottom */}
          <div className="mt-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back to Previous Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingEnhence;