import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { format, subDays } from 'date-fns';
import {
  ArrowUpTrayIcon,
  TruckIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// Components
import DateRangePicker from '../components/reports/DateRangePicker';
import ExportButton from '../components/reports/ExportButton';
import SummaryReportCard from '../components/reports/SummaryReportCard';
import StatusDistributionChart from '../components/reports/StatusDistributionChart';
import DeliveryPerformanceChart from '../components/reports/DeliveryPerformanceChart';
import ReportTable from '../components/reports/ReportTable';

// Services
import {
  getSummaryReport,
  getStatusReport,
  getPerformanceReport,
  getParcelList
} from '../services/reportService';

// Validation Schema
const reportSchema = Yup.object().shape({
  dateRange: Yup.object().shape({
    startDate: Yup.date()
      .required('Start date is required')
      .max(Yup.ref('endDate'), 'Start date must be before end date'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date')
  })
});

const ReportPage = () => {
  const initialValues = {
    dateRange: {
      startDate: subDays(new Date(), 30),
      endDate: new Date()
    },
    summaryData: null,
    statusData: null,
    performanceData: null,
    parcels: [],
    trends: {
      totalTrend: 0,
      deliveredTrend: 0,
      transitTrend: 0,
      revenueTrend: 0
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldValue }) => {
    try {
      setSubmitting(true);
      
      const [summary, status, performance, parcels] = await Promise.all([
        getSummaryReport(values.dateRange.startDate, values.dateRange.endDate),
        getStatusReport(),
        getPerformanceReport(
          values.dateRange.startDate.getMonth() + 1,
          values.dateRange.startDate.getFullYear()
        ),
        getParcelList(values.dateRange.startDate, values.dateRange.endDate)
      ]);

      // Calculate trends (mock implementation - replace with real logic)
      const trends = {
        totalTrend: summary.totalParcels > 100 ? 5.2 : -2.3,
        deliveredTrend: summary.deliveredCount > 50 ? 3.8 : -1.2,
        transitTrend: summary.inTransitCount > 30 ? -1.5 : 0.8,
        revenueTrend: summary.totalRevenue.doubleValue() > 5000 ? 7.4 : -3.1
      };

      setFieldValue('summaryData', summary);
      setFieldValue('statusData', status);
      setFieldValue('performanceData', performance);
      setFieldValue('parcels', parcels);
      setFieldValue('trends', trends);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Formik
        initialValues={initialValues}
        validationSchema={reportSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Parcel Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  {values.dateRange && 
                    `Showing data from ${format(values.dateRange.startDate, 'MMM d, yyyy')} to ${format(values.dateRange.endDate, 'MMM d, yyyy')}`
                  }
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <DateRangePicker name="dateRange" />
                <ExportButton disabled={isSubmitting} />
              </div>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SummaryReportCard
                title="Total Parcels"
                value={values.summaryData?.totalParcels || 0}
                icon={<ArrowUpTrayIcon className="h-6 w-6" />}
                trend={values.trends.totalTrend}
              />
              <SummaryReportCard
                title="Delivered"
                value={values.summaryData?.deliveredCount || 0}
                icon={<CheckCircleIcon className="h-6 w-6" />}
                trend={values.trends.deliveredTrend}
                className="bg-green-50"
              />
              <SummaryReportCard
                title="In Transit"
                value={values.summaryData?.inTransitCount || 0}
                icon={<TruckIcon className="h-6 w-6" />}
                trend={values.trends.transitTrend}
                className="bg-blue-50"
              />
              <SummaryReportCard
                title="Total Revenue"
                value={`$${(values.summaryData?.totalRevenue || 0).toFixed(2)}`}
                icon={<CurrencyDollarIcon className="h-6 w-6" />}
                trend={values.trends.revenueTrend}
                className="bg-purple-50"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <StatusDistributionChart />
              <DeliveryPerformanceChart />
            </div>

            {/* Parcel Data Table */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Parcel Details</h2>
              <ReportTable />
            </div>

            {/* Hidden submit button for form validation */}
            <button type="submit" className="hidden" disabled={isSubmitting}>
              Refresh Data
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReportPage;