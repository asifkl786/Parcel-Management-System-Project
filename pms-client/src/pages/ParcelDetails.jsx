import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getParcelById, updateParcel } from '../services/parcelService';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';


const ParcelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Formik setup with validation schema
  const formik = useFormik({
    initialValues: {
      senderName: '',
      recipientName: '',
      recipientEmail: '',
      trackingNumber: '',
      status: '',
      receivedAt: '',
      deliveredAt: '',
      imagePath: ''
    },
    validationSchema: Yup.object({
      senderName: Yup.string().required('Sender name is required'),
      recipientName: Yup.string().required('Recipient name is required'),
      recipientEmail: Yup.string().email('Invalid email format').required('Email is required'),
      trackingNumber: Yup.string().required('Tracking number is required'),
      status: Yup.string().required('Status is required'),
      receivedAt: Yup.date().required('Received date is required'),
      deliveredAt: Yup.date().when('status', {
        is: 'Delivered',
        then: Yup.date().required('Delivery date is required when status is Delivered')
      }),
    }),
    onSubmit: async (values) => {
      try {
        await updateParcel(id, values);
        setIsEditing(false);
        // Refresh data
        fetchParcel();
      } catch (error) {
        console.error('Update failed:', error);
      }
    }
  });

  // Fetch parcel data
  const fetchParcel = async () => {
    setIsLoading(true);
    try {
      const parcel = await getParcelById(id);
      // Format dates for input fields
      formik.setValues({
        ...parcel,
        receivedAt: parcel.receivedAt ? formatDateForInput(parcel.receivedAt) : '',
        deliveredAt: parcel.deliveredAt ? formatDateForInput(parcel.deliveredAt) : ''
      });
    } catch (error) {
      console.error('Error fetching parcel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for HTML input[type="datetime-local"]
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    fetchParcel();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
 
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      {/* Header with back button and title */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-2xl font-bold">Parcel Details</h2>
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 cursor-pointer"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Sender Information</h3>
            <div>
              <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">
                Sender Name
              </label>
              {isEditing ? (
                <>
                  <input
                    id="senderName"
                    name="senderName"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.senderName}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {formik.touched.senderName && formik.errors.senderName ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.senderName}</div>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 text-gray-900">{formik.values.senderName}</p>
              )}
            </div>
          </div>

          {/* Recipient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Recipient Information</h3>
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
                Recipient Name
              </label>
              {isEditing ? (
                <>
                  <input
                    id="recipientName"
                    name="recipientName"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.recipientName}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {formik.touched.recipientName && formik.errors.recipientName ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.recipientName}</div>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 text-gray-900">{formik.values.recipientName}</p>
              )}
            </div>

            <div>
              <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700">
                Recipient Email
              </label>
              {isEditing ? (
                <>
                  <input
                    id="recipientEmail"
                    name="recipientEmail"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.recipientEmail}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {formik.touched.recipientEmail && formik.errors.recipientEmail ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.recipientEmail}</div>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 text-gray-900">{formik.values.recipientEmail}</p>
              )}
            </div>
          </div>

          {/* Tracking Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Tracking Information</h3>
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700">
                Tracking Number
              </label>
              {isEditing ? (
                <>
                  <input
                    id="trackingNumber"
                    name="trackingNumber"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.trackingNumber}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {formik.touched.trackingNumber && formik.errors.trackingNumber ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.trackingNumber}</div>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 text-gray-900">{formik.values.trackingNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              {isEditing ? (
                <>
                  <select
                    id="status"
                    name="status"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.status}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select status</option>
                    <option value="Received">Received</option>
                    <option value="In Storage">In Storage</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  {formik.touched.status && formik.errors.status ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.status}</div>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 text-gray-900 capitalize">
                  {formik.values.status.toLowerCase().replace('_', ' ')}
                </p>
              )}
            </div>
          </div>

          {/* Timeline Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Timeline</h3>
            <div>
              <label htmlFor="receivedAt" className="block text-sm font-medium text-gray-700">
                Received At
              </label>
              {isEditing ? (
                <>
                  <input
                    id="receivedAt"
                    name="receivedAt"
                    type="datetime-local"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.receivedAt}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {formik.touched.receivedAt && formik.errors.receivedAt ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.receivedAt}</div>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 text-gray-900">{formatDateForDisplay(formik.values.receivedAt)}</p>
              )}
            </div>

            <div>
              <label htmlFor="deliveredAt" className="block text-sm font-medium text-gray-700">
                Delivered At
              </label>
              {isEditing ? (
                <>
                  <input
                    id="deliveredAt"
                    name="deliveredAt"
                    type="datetime-local"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.deliveredAt}
                    disabled={formik.values.status !== 'Delivered'}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      formik.values.status !== 'Delivered' ? 'bg-gray-100' : ''
                    }`}
                  />
                  {formik.touched.deliveredAt && formik.errors.deliveredAt ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.deliveredAt}</div>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 text-gray-900">
                  {formik.values.deliveredAt ? formatDateForDisplay(formik.values.deliveredAt) : 'N/A'}
                </p>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {formik.values.imagePath && (
            <div className="col-span-full space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Parcel Image</h3>
              <div className="flex justify-center">
                <img
                  src={`http://localhost:8080${formik.values.imagePath}`}
                  alt="Parcel"
                  className="max-h-64 rounded-md shadow"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/placeholder-image.jpg'; // Fallback image
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit button when editing */}
        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ParcelDetails;