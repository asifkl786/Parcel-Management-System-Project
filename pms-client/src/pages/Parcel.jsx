import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { parcelService } from '../services/parcelService';

const Parcel = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    senderName: '',
    recipientName: '',
    recipientEmail: '',
    trackingNumber: '',
    originCity: '',
    destinationCity: '',
    shippingCost: 0,
    additionalFees: 0,
    totalValue: 0,
    paymentMethod: '',
    parcelType: '',
    weightCategory: '',
    status: 'RECEIVED',
    receivedAt: new Date().toISOString().slice(0, 16),
    estimatedDeliveryAt: '',
    deliveredAt: '',
    imageFile: null
  });

  // Validation Schema
  const validationSchema = Yup.object().shape({
    senderName: Yup.string().required('Sender name is required'),
    recipientName: Yup.string().required('Recipient name is required'),
    recipientEmail: Yup.string().email('Invalid email').required('Email is required'),
    originCity: Yup.string().required('Origin city is required'),
    destinationCity: Yup.string().required('Destination city is required'),
    shippingCost: Yup.number()
      .min(0, 'Must be positive')
      .required('Shipping cost is required'),
    additionalFees: Yup.number().min(0, 'Must be positive'),
    totalValue: Yup.number()
      .min(0, 'Must be positive')
      .required('Total value is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
    parcelType: Yup.string().required('Parcel type is required'),
    weightCategory: Yup.string().required('Weight category is required'),
    receivedAt: Yup.date().required('Received date is required'),
    estimatedDeliveryAt: Yup.date()
      .required('Estimated delivery is required')
      .min(Yup.ref('receivedAt'), 'Must be after received date'),
    status: Yup.string().required('Status is required'),
    imageFile: Yup.mixed()
      .test('fileSize', 'File too large (max 5MB)', 
        value => !value || (value && value.size <= 5 * 1024 * 1024))
      .test('fileType', 'Only images allowed', 
        value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type)))
  });

  // Load parcel data for editing
  useEffect(() => {
    if (isEditMode && id) {
      const loadParcelData = async () => {
        try {
          const response = await parcelService.getParcelById(id);
          const parcel = response.data;
          
          setInitialValues({
            ...parcel,
            receivedAt: parcel.receivedAt ? parcel.receivedAt.slice(0, 16) : '',
            estimatedDeliveryAt: parcel.estimatedDeliveryAt ? parcel.estimatedDeliveryAt.slice(0, 16) : '',
            deliveredAt: parcel.deliveredAt ? parcel.deliveredAt.slice(0, 16) : '',
            imageFile: null // Don't preload existing image
          });
        } catch (error) {
          console.error('Error loading parcel:', error);
        }
      };
      
      loadParcelData();
    }
  }, [isEditMode, id]);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      // Prepare form data
      const formData = new FormData();
      
      // Convert dates to ISO format
      const dateFields = {
        receivedAt: new Date(values.receivedAt).toISOString(),
        estimatedDeliveryAt: new Date(values.estimatedDeliveryAt).toISOString(),
        deliveredAt: values.deliveredAt ? new Date(values.deliveredAt).toISOString() : null
      };

      // Append all values to formData
      Object.entries({ ...values, ...dateFields }).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Call appropriate service method
      if (isEditMode) {
        await parcelService.updateParcel(id, formData);
        setStatus({ success: 'Parcel updated successfully!' });
      } else {
        await parcelService.createParcel(formData);
        setStatus({ success: 'Parcel created successfully!' });
      }

      setTimeout(() => navigate('/parcels'), 1500);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({ error: error.response?.data?.message || 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Parcel' : 'Create New Parcel'}
      </h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, status }) => (
          <Form className="space-y-6">
            {/* Status Messages */}
            {status?.success && (
              <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                {status.success}
              </div>
            )}
            {status?.error && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {status.error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Sender Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sender Name*</label>
                  <Field
                    name="senderName"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="senderName" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              {/* Recipient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Recipient Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Recipient Name*</label>
                  <Field
                    name="recipientName"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="recipientName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Recipient Email*</label>
                  <Field
                    name="recipientEmail"
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="recipientEmail" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              {/* Tracking Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                <Field
                  name="trackingNumber"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status*</label>
                <Field
                  as="select"
                  name="status"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {Object.values(ParcelStatus).map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Location Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin City*</label>
                <Field
                  name="originCity"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <ErrorMessage name="originCity" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Destination City*</label>
                <Field
                  name="destinationCity"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <ErrorMessage name="destinationCity" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Financial Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Shipping Cost*</label>
                <Field
                  name="shippingCost"
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <ErrorMessage name="shippingCost" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Fees</label>
                <Field
                  name="additionalFees"
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <ErrorMessage name="additionalFees" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Value*</label>
                <Field
                  name="totalValue"
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <ErrorMessage name="totalValue" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Parcel Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method*</label>
                <Field
                  as="select"
                  name="paymentMethod"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select payment method</option>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT">Credit</option>
                  <option value="ONLINE">Online</option>
                </Field>
                <ErrorMessage name="paymentMethod" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Parcel Type*</label>
                <Field
                  as="select"
                  name="parcelType"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select parcel type</option>
                  <option value="DOCUMENT">Document</option>
                  <option value="PACKAGE">Package</option>
                  <option value="FREIGHT">Freight</option>
                </Field>
                <ErrorMessage name="parcelType" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Weight Category*</label>
                <Field
                  as="select"
                  name="weightCategory"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select weight category</option>
                  <option value="SMALL">Small</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LARGE">Large</option>
                </Field>
                <ErrorMessage name="weightCategory" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Received At*</label>
                <Field
                  name="receivedAt"
                  type="datetime-local"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <ErrorMessage name="receivedAt" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Delivery*</label>
                <Field
                  name="estimatedDeliveryAt"
                  type="datetime-local"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <ErrorMessage name="estimatedDeliveryAt" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Delivered At</label>
                <Field
                  name="deliveredAt"
                  type="datetime-local"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Parcel Image</label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("imageFile", event.currentTarget.files[0]);
                  }}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <ErrorMessage name="imageFile" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/parcels')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Parcel'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

// Helper for status enum
const ParcelStatus = {
  RECEIVED: 'RECEIVED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  FAILED_DELIVERY: 'FAILED_DELIVERY'
};

export default Parcel;