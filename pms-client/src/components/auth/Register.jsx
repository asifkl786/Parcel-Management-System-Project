import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../../services/authService';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import fallbackLoginImage from "../../assets/images/login.jpg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Tailwind Heroicons

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

  const Register = () => {
   const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form Data Submitted:",values);
    try {
      await register(values);
      toast.success('Registration Successful', {
        position: 'top-center',
        theme: 'colored',
      });
      navigate("/login");
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

  const publicImagePath = "/images/login.jpg";
  const backgroundImageUrl = `${window.location.origin}${publicImagePath}`;

  return (
           
     <div
          className="h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImageUrl}), url(${fallbackLoginImage})`,
          }}
        >

            <div className="bg-white/85 p-8 rounded-lg shadow-lg w-[350px]">
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

                    {/* Password Field with Eye Toggle */}
                        <div className="mb-4 relative">
                            <label className="block text-gray-700">Password</label>
                            <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 pr-10"
                            />
                            <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                            </button>
                            <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm"
                            />
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
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                    </p>
                </Form>
                )}
            </Formik>
            </div>
    </div>
  );
};

export default Register;