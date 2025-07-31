import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const validationSchema = Yup.object().shape({
  senderName: Yup.string().required('Sender name is required'),
  recipientName: Yup.string().required('Recipient name is required'),
  recipientEmail: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  status: Yup.string().required('Status is required'),
  receivedAt: Yup.date().required('Received date is required'),
  deliveredAt: Yup.date().nullable(),
  imageFile: Yup.mixed()
    .test('fileSize', 'File too large (max 5MB)', 
      value => !value || value.size <= 5 * 1024 * 1024)
    .test('fileType', 'Only JPEG/PNG allowed', 
      value => !value || ['image/jpeg', 'image/png'].includes(value.type))
});

const statusOptions = [
  { value: 'RECEIVED', label: 'Received' },
  { value: 'IN_STORAGE', label: 'In Storage' },
  { value: 'DELIVERED', label: 'Delivered' }
];

const ParcelForm = ({ initialValues, onSubmit, isSubmitting, buttonText = 'Submit' }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              {buttonText === 'Submit' ? 'Add New Parcel' : 'Edit Parcel'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender Information */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sender Name *</label>
                <Field
                  name="senderName"
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="senderName">
                  {msg => <FormError message={msg} />}
                </ErrorMessage>
              </div>

              {/* Recipient Information */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Recipient Name *</label>
                <Field
                  name="recipientName"
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="recipientName">
                  {msg => <FormError message={msg} />}
                </ErrorMessage>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Recipient Email *</label>
                <Field
                  name="recipientEmail"
                  type="email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="recipientEmail">
                  {msg => <FormError message={msg} />}
                </ErrorMessage>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status *</label>
                <Field
                  as="select"
                  name="status"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Received At *</label>
                <Field
                  name="receivedAt"
                  type="datetime-local"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="receivedAt">
                  {msg => <FormError message={msg} />}
                </ErrorMessage>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Delivered At</label>
                <Field
                  name="deliveredAt"
                  type="datetime-local"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Parcel Image</label>
              <input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={e => setFieldValue("imageFile", e.currentTarget.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <ErrorMessage name="imageFile">
                {msg => <FormError message={msg} />}
              </ErrorMessage>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : buttonText}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

// Reusable error component
const FormError = ({ message }) => (
  <div className="flex items-center text-red-600 text-sm mt-1">
    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
    <span>{message}</span>
  </div>
);

export default ParcelForm;