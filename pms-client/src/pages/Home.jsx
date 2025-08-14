import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/landing.jpg"; // अपने image का सही path

export default function Home() {
  return (
    <div
      className="w-screen h-screen animate-zoom flex flex-col items-center justify-center text-white text-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
        Parcel Management System
      </h1>
      <p className="mb-8 max-w-md drop-shadow-md">
        Efficient logistics and delivery tracking solution for modern businesses
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
