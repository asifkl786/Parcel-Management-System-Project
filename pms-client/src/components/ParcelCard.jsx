import { 
  TruckIcon, 
  CheckIcon, 
  ClockIcon, 
  ArrowUturnLeftIcon, 
  PaperAirplaneIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

// Tailwind doesn't have "slow" animations by default for bounce/spin, so we add custom classes via inline style
const statusIcons = {
  DELIVERED: <CheckIcon className="h-5 w-5 text-green-500 animate-pulse" />,
  IN_STORAGE: <TruckIcon className="h-5 w-5 text-yellow-500 animate-bounce" style={{ animationDuration: '2s' }} />,
  RECEIVED: <ClockIcon className="h-5 w-5 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />,
  RETURN: <ArrowUturnLeftIcon className="h-5 w-5 text-purple-500 animate-[spin_1.5s_linear_infinite]" style={{ animationDirection: 'reverse' }} />,
  IN_TRANSIT: <PaperAirplaneIcon className="h-5 w-5 text-orange-500 animate-bounce" />,
  FAILED_DELIVERY: <XCircleIcon className="h-5 w-5 text-red-500 animate-pulse" />
};

const statusColors = {
  DELIVERED: 'bg-green-100 text-green-800',
  IN_STORAGE: 'bg-yellow-100 text-yellow-800',
  RECEIVED: 'bg-blue-100 text-blue-800',
  RETURN: 'bg-purple-100 text-purple-800',
  IN_TRANSIT: 'bg-orange-100 text-orange-800',
  FAILED_DELIVERY: 'bg-red-100 text-red-800'
};

const ParcelCard = ({ parcel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{parcel.trackingNumber}</h3>
            <p className="text-sm text-gray-500">To: {parcel.recipientName}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[parcel.status] || 'bg-gray-100 text-gray-800'}`}>
            {statusIcons[parcel.status] || null}
            <span className="ml-1 capitalize">
              {parcel.status.toLowerCase().replace('_', ' ')}
            </span>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">From</p>
            <p className="font-medium">{parcel.senderName}</p>
          </div>
          <div>
            <p className="text-gray-500">Received</p>
            <p className="font-medium">
              {new Date(parcel.receivedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {parcel.deliveredAt && (
          <div className="mt-2">
            <p className="text-gray-500">Delivered</p>
            <p className="font-medium">
              {new Date(parcel.deliveredAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <Link
            to={`/view-details/${parcel.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
          <Link
            to={`/tracking?number=${parcel.trackingNumber}`}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Track
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParcelCard;
