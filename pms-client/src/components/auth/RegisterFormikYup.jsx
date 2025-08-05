import React from "react";
import { useNavigate } from "react-router-dom";
//import { register } from "../services/authService";
import { register } from '../../services/authService';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username too long')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['USER', 'ADMIN','MANAGER','COURIER'], 'Invalid role')
    .required('Role is required')
});

const RegisterFormikYup = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form Data Submitted:",values);
    try {
      await register(values);
      toast.success('Registration Successful', {
        position: 'top-center',
        theme: 'colored',
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error('Email already registered or something went wrong', {
        position: 'top-center',
        theme: 'colored',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
      
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          role: "USER"
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Username Field */}
            <div>
              <Field
                type="text"
                name="username"
                placeholder="Username"
                className="w-full px-4 py-2 border rounded"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Email Field */}
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Password Field */}
            <div>
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Role Selection */}
            <div>
              <Field
                as="select"
                name="role"
                className="w-full px-4 py-2 border rounded"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="COURIER">COURIER</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>

            {/* Login Link */}
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterFormikYup;