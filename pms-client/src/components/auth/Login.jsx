import React, { useState } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import fallbackLoginImage from "../../assets/images/login.jpg";
import { login } from '../../services/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Tailwind Heroicons

const Login = () => {
   const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  });

 const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form Data Submitted:",values);
    try {
      await login(values);
      toast.success('Login Successful', {
        position: 'top-center',
        theme: 'colored',
      });
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error('Invalid Email and Password Try again later', {
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
        <h2 className="text-center mb-4 text-xl font-semibold">Login</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
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

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </button>

            {/* Register Link */}
                    <p className="mt-4 text-center">
                    Not Register then Register first?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                    </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
