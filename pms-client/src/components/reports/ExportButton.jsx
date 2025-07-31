import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useFormikContext } from 'formik';

const ExportButton = ({ className = '' }) => {
  const { values, isValid } = useFormikContext();

  const handleExport = async () => {
    try {
      // Your export logic here using values.startDate and values.endDate
      console.log('Exporting with:', values);
      alert(`Exporting data from ${values.startDate} to ${values.endDate}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={!isValid}
      className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 ${className}`}
    >
      <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
      Export to Excel
    </button>
  );
};

export default ExportButton;