import { Link } from 'react-router-dom';
import { ClockIcon, CheckIcon, TruckIcon } from '@heroicons/react/24/outline';

const ParcelList = ({ parcels }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'IN_STORAGE':
        return <TruckIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tracking #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recipient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Received At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parcels.map((parcel) => (
            <tr key={parcel.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {parcel.trackingNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {parcel.recipientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getStatusIcon(parcel.status)}
                  <span className="ml-2 text-sm text-gray-500 capitalize">
                    {parcel.status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(parcel.receivedAt).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParcelList;