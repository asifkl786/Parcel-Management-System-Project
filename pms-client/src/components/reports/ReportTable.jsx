import { useFormikContext } from 'formik';
import { format } from 'date-fns';

const ReportTable = () => {
  const { values, isSubmitting } = useFormikContext();

  if (isSubmitting) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!values.parcels || values.parcels.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table headers same as before */}
        <tbody className="bg-white divide-y divide-gray-200">
          {values.parcels.map((parcel) => (
            <tr key={parcel.trackingNumber}>
              {/* Table cells same as before */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;