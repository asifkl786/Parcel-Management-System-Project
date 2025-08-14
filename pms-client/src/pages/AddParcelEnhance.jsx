import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { createParcel } from '../services/parcelService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddParcel = () => {
  const navigate = useNavigate();

  const initialValues = {
    senderName: '',
    recipientName: '',
    recipientEmail: '',
    originCity: '',
    destinationCity: '',
   // shippingCost: 0,
    shippingCost:'',
   // additionalFees: 0,
    additionalFees:'',
   // totalValue: 0,
    totalValue:'0.00',
    paymentMethod: '',
    parcelType: '',
    weightCategory: '',
    status: 'RECEIVED',
    receivedAt: new Date().toISOString().slice(0, 16),
    deliveredAt: '',
    estimatedDeliveryAt: '',
    imageFile: null
  };
  
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
    estimatedDeliveryAt: Yup.date().required('Estimated delivery date is required'),
    deliveredAt: Yup.date().nullable(),
    imageFile: Yup.mixed()
      .test(
        'fileSize', 
        'File too large (max 5MB)', 
        (value) => !value || (value && value.size <= 5 * 1024 * 1024)
      )
      .test(
        'fileType', 
        'Unsupported file type (only JPEG/PNG)', 
        (value) => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))
      )
  });

        // This method for calculate total values
      const calculateTotal = (values, setFieldValue) => {
      const shipping = parseFloat(values.shippingCost) || 0;
      const fees = parseFloat(values.additionalFees) || 0;
      const total = (shipping + fees).toFixed(2);
      setFieldValue('totalValue', total);
      };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form Submitted Values:",values);
    try {
      const parcelData = {
        ...values,
        receivedAt: new Date(values.receivedAt).toISOString(),
        estimatedDeliveryAt: new Date(values.estimatedDeliveryAt).toISOString(),
        deliveredAt: values.deliveredAt ? new Date(values.deliveredAt).toISOString() : null,
        /* This three line of code Convert string numbers to actual numbers */
        shippingCost: parseFloat(values.shippingCost),
        additionalFees: parseFloat(values.additionalFees || 0),
        totalValue: parseFloat(values.totalValue)
      };

        // Remove undefined/null values
        const cleanparcelData = Object.fromEntries(
          Object.entries(parcelData).filter(([_, v]) => v !== null && v !== undefined)
        );

      await createParcel(cleanparcelData);
      toast.success("✅ Parcel created successfully!", { position: 'top-center' });
      navigate('/dashboard');
    } catch (error) {
      toast.error("❌ Error adding parcel", { position: 'top-center' });
      console.error('Error creating parcel:', error);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Parcel</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values,isSubmitting, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sender Name*</label>
                  <Field
                    type="text"
                    name="senderName"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="senderName" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Recipient Name*</label>
                  <Field
                    type="text"
                    name="recipientName"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="recipientName" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Recipient Email*</label>
                  <Field
                    type="email"
                    name="recipientEmail"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="recipientEmail" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Origin City*</label>
                  <Field
                    type="text"
                    name="originCity"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="originCity" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination City*</label>
                  <Field
                    type="text"
                    name="destinationCity"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="destinationCity" component="div" className="text-red-500 text-sm" />
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
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="RETURNED">Returned</option>
                    <option value="FAILED_DELIVERY">Failed Delivery</option>
                  </Field>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method*</label>
                  <Field
                    as="select"
                    name="paymentMethod"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="CASH">Cash</option>
                    <option value="CREDIT">Credit</option>
                    <option value="ONLINE">Online</option>
                  </Field>
                  <ErrorMessage name="paymentMethod" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Parcel Type*</label>
                  <Field
                    as="select"
                    name="parcelType"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select parcel type</option>
                    <option value="DOCUMENT">Document</option>
                    <option value="PACKAGE">Package</option>
                    <option value="FREIGHT">Freight</option>
                  </Field>
                  <ErrorMessage name="parcelType" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight Category*</label>
                  <Field
                    as="select"
                    name="weightCategory"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select weight category</option>
                    <option value="SMALL">Small</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LARGE">Large</option>
                  </Field>
                  <ErrorMessage name="weightCategory" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Row 2 */}{/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Shipping Cost*</label>
                <Field
                  type="number"
                  name="shippingCost"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"

                         onChange={(e) => {
                          setFieldValue('shippingCost', e.target.value);
                          calculateTotal(
                            { ...values, shippingCost: e.target.value },
                            setFieldValue
                          );
                        }}
                />
                <ErrorMessage name="shippingCost" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Column 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Fees</label>
                <Field
                  type="number"
                  name="additionalFees"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onChange={(e) => {
                            setFieldValue('additionalFees', e.target.value);
                            calculateTotal(
                              { ...values, additionalFees: e.target.value },
                              setFieldValue
                            );
                          }}
                />
                <ErrorMessage name="additionalFees" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Column 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Value*</label>
                <Field
                  type="number"
                  name="totalValue"
                  // min="0"
                  // step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  readOnly
                />
                <ErrorMessage name="totalValue" component="div" className="text-red-500 text-sm" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Received At*</label>
                <Field
                  type="datetime-local"
                  name="receivedAt"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="receivedAt" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Column 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Delivery*</label>
                <Field
                  type="datetime-local"
                  name="estimatedDeliveryAt"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorMessage name="estimatedDeliveryAt" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Column 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivered At</label>
                <Field
                  type="datetime-local"
                  name="deliveredAt"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 4 - Image Upload */}
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

            <div className="flex justify-end space-x-3 pt-6">
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