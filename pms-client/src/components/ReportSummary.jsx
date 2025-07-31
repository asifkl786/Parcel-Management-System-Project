import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon, CurrencyDollarIcon, CubeIcon, TruckIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

const ReportSummary = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date')
  });

  const formik = useFormik({
    initialValues: {
      startDate: '',
      endDate: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        // Format dates to ISO string
        const startDate = new Date(values.startDate).toISOString();
        const endDate = new Date(values.endDate).toISOString();
        
        const response = await fetch(
          `http://localhost:8080/api/reports/summary?startDate=${startDate}&endDate=${endDate}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }
        
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
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

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading || !formik.isValid}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ReportSummary;