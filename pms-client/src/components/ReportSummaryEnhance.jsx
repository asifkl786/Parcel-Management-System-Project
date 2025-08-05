import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  ExclamationCircleIcon, 
  ArrowPathIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  CubeIcon, 
  TruckIcon, 
  ArrowUturnLeftIcon 
} from '@heroicons/react/24/solid';
import { 
  fetchReportData, 
  exportReport, 
  downloadFile 
} from '../services/reportService';

const ReportSummaryEnhance = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState({ excel: false, pdf: false });
  const [error, setError] = useState(null);

  const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date')
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = new Date(values.startDate).toISOString();
      const endDate = new Date(values.endDate).toISOString();
      
      const data = await fetchReportData(startDate, endDate);
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  // In your ReportSummaryEnhance component
    const handleExport = async (type) => {
      try {
        setExporting(prev => ({ ...prev, [type]: true }));
        setError(null);
        
        const { startDate, endDate } = formik.values;
        
        if (!startDate || !endDate) {
          throw new Error('Please select date range first');
        }

        const blob = await exportReport(type, startDate, endDate);
        downloadFile(
          blob, 
          `parcels_report_${startDate}_to_${endDate}.${type}`
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setExporting(prev => ({ ...prev, [type]: false }));
      }
    };
  const formik = useFormik({
    initialValues: {
      startDate: '',
      endDate: ''
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Parcel Report Summary</h1>
          <p className="mt-2 text-sm text-gray-600">
            Analyze parcel delivery statistics for any date range
          </p>
        </div>

        {/* Date Range Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.startDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    <span>{formik.errors.startDate}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.endDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    <span>{formik.errors.endDate}</span>
                  </div>
                )}
              </div>

              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  disabled={loading || !formik.isValid}
                  className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Generate Report'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Export Buttons - Only show when we have report data */}
          {reportData && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Export Report</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleExport('excel')}
                  disabled={exporting.excel || !formik.values.startDate || !formik.values.endDate}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting.excel ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <TableCellsIcon className="h-4 w-4 mr-2" />
                      Excel
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  disabled={exporting.pdf || !formik.values.startDate || !formik.values.endDate}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting.pdf ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      PDF
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleExport('excel');
                    handleExport('pdf');
                  }}
                  disabled={exporting.excel || exporting.pdf || !formik.values.startDate || !formik.values.endDate}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting.excel || exporting.pdf ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                      Exporting Both...
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Both Formats
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Exports will use the currently selected date range
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Report Data */}
        {reportData && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Parcels */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <CubeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Parcels</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {reportData.totalParcels}
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <CurrencyDollarIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(reportData.totalRevenue)}
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Average Shipping Cost */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <ChartBarIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg. Shipping</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(reportData.averageShippingCost)}
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Status Summary */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <TruckIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Delivery Status</dt>
                      <dd className="flex items-baseline space-x-4">
                        <div className="text-sm font-semibold text-green-600">
                          Delivered: {reportData.deliveredCount}
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                          In Transit: {reportData.inTransitCount}
                        </div>
                        <div className="text-sm font-semibold text-red-600">
                          Returned: {reportData.returnedCount}
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Monthly Counts */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Monthly Parcel Counts</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ul className="divide-y divide-gray-200">
                    {Object.entries(reportData.monthlyCounts).map(([month, count]) => (
                      <li key={month} className="py-4 flex justify-between">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{month}</span>
                        </div>
                        <div className="text-sm text-gray-500">{count} parcels</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Payment Method Distribution */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Methods</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ul className="divide-y divide-gray-200">
                    {Object.entries(reportData.paymentMethodDistribution).map(([method, count]) => (
                      <li key={method} className="py-4 flex justify-between">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{method}</span>
                        </div>
                        <div className="text-sm text-gray-500">{count} parcels</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Summary Chart Placeholder */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Delivery Performance</h3>
              </div>
              <div className="px-4 py-5 sm:p-6 h-64 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSummaryEnhance;

