import { useFormikContext } from 'formik';

const SummaryReportCard = ({ title, valueKey, icon, trendKey, className = '' }) => {
  const { values } = useFormikContext();
  const trend = values[trendKey] || 0;
  const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500';
  const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {values[valueKey] || 0}
          </p>
        </div>
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
      {trend !== 0 && (
        <div className={`mt-4 flex items-center text-sm ${trendColor}`}>
          <span className="font-medium">{trendIcon} {Math.abs(trend)}%</span>
          <span className="ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default SummaryReportCard;