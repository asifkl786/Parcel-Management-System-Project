import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getParcelById, updateParcel } from '../services/parcelService';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const EditParcel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const data = await getParcelById(id);
        console.log("Fetched Parcel", data);
        setParcel(data);
      } catch (error) {
        console.error('Error fetching parcel:', error);
        setError('Failed to load parcel data');
      } finally {
        setLoading(false);
      }
    };
    fetchParcel();
  }, [id]);

  const validationSchema = Yup.object().shape({
    senderName: Yup.string().required('Sender name is required'),
    recipientName: Yup.string().required('Recipient name is required'),
    recipientEmail: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    originCity: Yup.string().required('Origin city is required'),
    destinationCity: Yup.string().required('Destination city is required'),
    shippingCost: Yup.number().min(0).required('Shipping cost is required'),
    additionalFees: Yup.number().min(0),
    totalValue: Yup.number().min(0).required('Total value is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
    parcelType: Yup.string().required('Parcel type is required'),
    weightCategory: Yup.string().required('Weight category is required'),
    status: Yup.string().required('Status is required'),
    receivedAt: Yup.date().required('Received date is required'),
    estimatedDeliveryAt: Yup.date()
      .required('Estimated delivery date is required')
      .min(Yup.ref('receivedAt'), 'Must be after received date'),
    deliveredAt: Yup.date().nullable(),
    trackingNumber: Yup.string().required('Tracking number is required'),
  });
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      // Prepare the data for submission
      const submissionData = {
        ...values,
        // Convert dates to proper ISO format
        receivedAt: new Date(values.receivedAt).toISOString(),
        estimatedDeliveryAt: new Date(values.estimatedDeliveryAt).toISOString(),
        deliveredAt: values.deliveredAt ? new Date(values.deliveredAt).toISOString() : null,
        // Convert numbers properly
        shippingCost: Number(values.shippingCost),
        additionalFees: Number(values.additionalFees),
        totalValue: Number(values.totalValue)
      };

      // Remove undefined/null values
      const cleanData = Object.fromEntries(
        Object.entries(submissionData).filter(([_, v]) => v !== null && v !== undefined)
      );

      await updateParcel(id, cleanData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating parcel:', error);
      setError(error.response?.data?.message || 'Failed to update parcel. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const FormError = ({ message }) => (
    <div className="flex items-center text-red-600 text-sm mt-1">
      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
      <span>{message}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Edit Parcel</h2>
        <div className="text-center py-8">
          <p className="text-red-500">{error || 'Parcel not found'}</p>
          <button
            onClick={() => navigate('/parcels')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Parcels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Parcel</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <Formik
        initialValues={{
          senderName: parcel.senderName || '',
          recipientName: parcel.recipientName || '',
          recipientEmail: parcel.recipientEmail || '',
          originCity: parcel.originCity || '',
          destinationCity: parcel.destinationCity || '',
          shippingCost: parcel.shippingCost || 0,
          additionalFees: parcel.additionalFees || 0,
          totalValue: parcel.totalValue || 0,
          paymentMethod: parcel.paymentMethod || 'CASH',
          parcelType: parcel.parcelType || 'DOCUMENT',
          weightCategory: parcel.weightCategory || 'SMALL',
          status: parcel.status || 'RECEIVED',
          receivedAt: formatDateForInput(parcel.receivedAt),
          estimatedDeliveryAt: formatDateForInput(parcel.estimatedDeliveryAt),
          deliveredAt: formatDateForInput(parcel.deliveredAt),
          trackingNumber: parcel.trackingNumber || '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sender Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Sender Name *</label>
                <Field
                  type="text"
                  name="senderName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="senderName" component={FormError} />
              </div>

              {/* Recipient Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Recipient Name *</label>
                <Field
                  type="text"
                  name="recipientName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="recipientName" component={FormError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Recipient Email *</label>
                <Field
                  type="email"
                  name="recipientEmail"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="recipientEmail" component={FormError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tracking Number *</label>
                <Field
                  type="text"
                  name="trackingNumber"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="trackingNumber" component={FormError} />
              </div>

              {/* Location Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin City *</label>
                <Field
                  type="text"
                  name="originCity"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="originCity" component={FormError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Destination City *</label>
                <Field
                  type="text"
                  name="destinationCity"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="destinationCity" component={FormError} />
              </div>

              {/* Financial Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Shipping Cost *</label>
                <Field
                  type="number"
                  name="shippingCost"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="shippingCost" component={FormError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Fees</label>
                <Field
                  type="number"
                  name="additionalFees"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="additionalFees" component={FormError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Value *</label>
                <Field
                  type="number"
                  name="totalValue"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="totalValue" component={FormError} />
              </div>

              {/* Parcel Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
                <Field
                  as="select"
                  name="paymentMethod"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="CASH">Cash</option>
                  <option value="CREDIT">Credit</option>
                  <option value="ONLINE">Online</option>
                </Field>
                <ErrorMessage name="paymentMethod" component={FormError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Parcel Type *</label>
                <Field
                  as="select"
                  name="parcelType"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="DOCUMENT">Document</option>
                  <option value="PACKAGE">Package</option>
                  <option value="FREIGHT">Freight</option>
                </Field>
                <ErrorMessage name="parcelType" component={FormError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Weight Category *</label>
                <Field
                  as="select"
                  name="weightCategory"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="SMALL">Small</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LARGE">Large</option>
                </Field>
                <ErrorMessage name="weightCategory" component={FormError} />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status *</label>
                <Field 
                  as="select"
                  name="status"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="RECEIVED">Received</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="RETURNED">Returned</option>
                  <option value="FAILED_DELIVERY">Failed Delivery</option>
                </Field>
                <ErrorMessage name="status" component={FormError} />
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Received At *</label>
                <Field
                  type="datetime-local"
                  name="receivedAt"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="receivedAt" component={FormError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Delivery *</label>
                <Field
                  type="datetime-local"
                  name="estimatedDeliveryAt"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="estimatedDeliveryAt" component={FormError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Delivered At</label>
                <Field
                  type="datetime-local"
                  name="deliveredAt"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Parcel'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditParcel;

