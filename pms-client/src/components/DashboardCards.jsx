
import { CubeIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';


const DashboardCards = ({ parcels }) => {
  const stats = [
    { 
      name: 'Total Parcels', 
      value: parcels.length, 
      icon: CubeIcon,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    { 
      name: 'Delivered', 
      value: parcels.filter(p => p.status === 'DELIVERED').length,
      icon: CheckIcon,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      name: 'In Transit', 
      value: parcels.filter(p => p.status === 'IN_STORAGE').length,
      icon: ClockIcon,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;