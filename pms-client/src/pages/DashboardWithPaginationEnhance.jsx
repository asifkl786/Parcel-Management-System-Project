import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getParcelsWithPagination } from '../services/parcelService';
import Pagination from '../components/Pagination';

const DashboardWithPaginationEnhance = () => {
  const [parcelsData, setParcelsData] = useState({
    content: [],
    pageable: {},
    totalPages: 0,
    totalElements: 0,
    numberOfElements: 0,
    first: true,
    last: false,
    empty: true
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sort, setSort] = useState('receivedAt,desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchParcels = async () => {
      try {
        setLoading(true);
        const data = await getParcelsWithPagination(currentPage, pageSize, sort);
        
        if (!isMounted) return;
        
        if (!data || !Array.isArray(data.content)) {
          throw new Error('Invalid data format received from API');
        }

        setParcelsData({
          content: data.content,
          pageable: data.pageable || {},
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          numberOfElements: data.numberOfElements || 0,
          first: data.first ?? true,
          last: data.last ?? false,
          empty: data.empty ?? true
        });
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching parcels:', err);
        setError(err.message);
        setParcelsData(prev => ({
          ...prev,
          content: [],
          empty: true
        }));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchParcels();

    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, sort]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (column) => {
    const isDesc = sort.startsWith(column) && sort.endsWith('desc');
    setSort(`${column},${isDesc ? 'asc' : 'desc'}`);
    setCurrentPage(0);
  };

  const formatStatus = (status) => {
    return status.toLowerCase().replace('_', ' ');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800';
      case 'RECEIVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'RETURNED':
        return 'bg-purple-100 text-purple-800';
      case 'FAILED_DELIVERY':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading parcels: {error}
              </p>
              <button 
                onClick={() => {
                  setError(null);
                  setCurrentPage(0);
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Parcel Management Dashboard
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Showing {parcelsData.numberOfElements} of {parcelsData.totalElements} parcels
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('trackingNumber')}>
                  Tracking #
                  {sort.startsWith('trackingNumber') && (
                    <span>{sort.endsWith('desc') ? ' ↓' : ' ↑'}</span>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('senderName')}>
                  Sender
                  {sort.startsWith('senderName') && (
                    <span>{sort.endsWith('desc') ? ' ↓' : ' ↑'}</span>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                  Status
                  {sort.startsWith('status') && (
                    <span>{sort.endsWith('desc') ? ' ↓' : ' ↑'}</span>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('receivedAt')}>
                  Received
                  {sort.startsWith('receivedAt') && (
                    <span>{sort.endsWith('desc') ? ' ↓' : ' ↑'}</span>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('deliveredAt')}>
                  Delivered
                  {sort.startsWith('deliveredAt') && (
                    <span>{sort.endsWith('desc') ? ' ↓' : ' ↑'}</span>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parcelsData.content.length > 0 ? (
                parcelsData.content.map((parcel) => (
                  <tr key={parcel.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {parcel.trackingNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.senderName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(parcel.status)}`}>
                        {formatStatus(parcel.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(parcel.receivedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.deliveredAt ? new Date(parcel.deliveredAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/edit-parcel/${parcel.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/tracking?number=${parcel.trackingNumber}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {parcelsData.empty ? 'No parcels found' : 'Loading parcels...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {parcelsData.totalPages > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={parcelsData.totalPages}
              onPageChange={handlePageChange}
            />
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Items per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardWithPaginationEnhance;