import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { uploadParcel } from '../services/parcelService';

const AddParcel = () => {
  const navigate = useNavigate();

  const initialValues = {
    senderName: '',
    recipientName: '',
    recipientEmail: '',
    status: 'RECEIVED',
    receivedAt: new Date().toISOString().slice(0, 16),
    deliveredAt: '',
    trackingNumber: '',
    imageFile: null
  };

const validationSchema = Yup.object().shape({
  senderName: Yup.string().required('Sender name is required'),
  recipientName: Yup.string().required('Recipient name is required'),
  recipientEmail: Yup.string().email('Invalid email').required('Email is required'),
  receivedAt: Yup.date().required('Received date is required'),
  deliveredAt: Yup.date().nullable(),
  imageFile: Yup.mixed()
    .test(
      'fileSize', 
      'File too large', 
      (value) => !value || (value && value.size <= 5 * 1024 * 1024)
    )
    .test(
      'fileType', 
      'Unsupported file type', 
      (value) => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))
    )
});

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    try {
     // await createParcel(values, values.imageFile);
      await uploadParcel(values);
      navigate('/');
    } catch (error) {
      console.error('Error creating parcel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Parcel</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sender Name</label>
                <Field
                  type="text"
                  name="senderName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="senderName" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
                <Field
                  type="text"
                  name="recipientName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="recipientName" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Recipient Email</label>
                <Field
                  type="email"
                  name="recipientEmail"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="recipientEmail" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="RECEIVED">Received</option>
                  <option value="IN_STORAGE">In Storage</option>
                  <option value="DELIVERED">Delivered</option>
                </Field>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Received At</label>
                <Field
                  type="datetime-local"
                  name="receivedAt"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="receivedAt" component="div" className="text-red-500 text-sm" />
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

            <div>
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
              <ErrorMessage name="imageFile" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="flex justify-end space-x-3">
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

export default AddParcel;