import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { 
  getSummaryReport, 
  getStatusReport, 
  getPerformanceReport,
  getParcelList 
} from '../services/reportService';
import SummaryReportCard from './SummaryReportCard';
import StatusDistributionChart from './StatusDistributionChart';
import DeliveryPerformanceChart from './DeliveryPerformanceChart';
import DateRangePicker from './DateRangePicker';
import ExportButton from './ExportButton';
import ReportTable from './ReportTable';
import {
  ArrowUpTrayIcon,
  TruckIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const validationSchema = Yup.object().shape({
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
});

const ReportDashboard = () => {
  const initialValues = {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    summaryData: null,
    statusData: null,
    performanceData: null,
    parcels: [],
    trends: {
      totalTrend: 5.2,
      deliveredTrend: 3.8,
      transitTrend: -1.5,
      revenueTrend: 7.4
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldValue }) => {
    try {
      setSubmitting(true);
      
      const [summary, status, performance, parcels] = await Promise.all([
        getSummaryReport(values.startDate, values.endDate),
        getStatusReport(),
        getPerformanceReport(
          values.startDate.getMonth() + 1,
          values.startDate.getFullYear()
        ),
        getParcelList(values.startDate, values.endDate)
      ]);

      setFieldValue('summaryData', summary);
      setFieldValue('statusData', status);
      setFieldValue('performanceData', performance);
      setFieldValue('parcels', parcels);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Parcel Reports Dashboard</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <DateRangePicker name="dateRange" />
              <ExportButton />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryReportCard
              title="Total Parcels"
              valueKey="summaryData.totalParcels"
              icon={<ArrowUpTrayIcon className="h-6 w-6" />}
              trendKey="trends.totalTrend"
            />
            <SummaryReportCard
              title="Delivered"
              valueKey="summaryData.deliveredCount"
              icon={<CheckCircleIcon className="h-6 w-6" />}
              trendKey="trends.deliveredTrend"
              className="bg-green-50"
            />
            <SummaryReportCard
              title="In Transit"
              valueKey="summaryData.inTransitCount"
              icon={<TruckIcon className="h-6 w-6" />}
              trendKey="trends.transitTrend"
              className="bg-blue-50"
            />
            <SummaryReportCard
              title="Total Revenue"
              valueKey="summaryData.totalRevenue"
              valueFormatter={val => `$${val?.toFixed(2) || '0.00'}`}
              icon={<CurrencyDollarIcon className="h-6 w-6" />}
              trendKey="trends.revenueTrend"
              className="bg-purple-50"
            />
          </div>

          {/* Charts and Table */}
          <StatusDistributionChart />
          <DeliveryPerformanceChart />
          <ReportTable />
        </Form>
      )}
    </Formik>
  );
};

export default ReportDashboard;