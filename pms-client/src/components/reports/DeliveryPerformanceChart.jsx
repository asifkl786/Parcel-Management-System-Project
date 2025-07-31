import { useFormikContext } from 'formik';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DeliveryPerformanceChart = () => {
  const { values, isSubmitting } = useFormikContext();

  if (isSubmitting) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!values.performanceData || !values.performanceData.performanceByCity) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No delivery performance data available
      </div>
    );
  }

  const chartData = {
    labels: Object.keys(values.performanceData.performanceByCity),
    datasets: [
      {
        label: 'Average Delivery Time (hours)',
        data: Object.values(values.performanceData.performanceByCity),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw.toFixed(1)} hours`;
          }
        }
      },
      title: {
        display: true,
        text: 'Delivery Performance by City',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 mr-1"></div>
            <span>Lower values indicate better performance</span>
          </div>
        </div>
        {values.performanceData.onTimeDeliveryRate && (
          <div className="text-center mt-2">
            Overall On-Time Delivery Rate: <strong>
              {values.performanceData.onTimeDeliveryRate}%
            </strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPerformanceChart;