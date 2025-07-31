import { useFormikContext } from 'formik';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusDistributionChart = () => {
  const { values, isSubmitting } = useFormikContext();

  if (isSubmitting) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  const chartData = {
    labels: values.statusData?.map(item => item.status) || [],
    datasets: [{
      data: values.statusData?.map(item => item.count) || [],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      borderWidth: 1,
    }]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h2 className="text-lg font-semibold mb-4">Parcel Status Distribution</h2>
      <div className="h-64">
        <Pie data={chartData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right' } }
        }} />
      </div>
    </div>
  );
};

export default StatusDistributionChart;