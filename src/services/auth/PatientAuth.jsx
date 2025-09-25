import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate

export default function PatientAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    age: "",
    fullName: "",
    gender: "",
    address: "",
    height: "",
    weight: "",
    diseases: "",
  });

  const navigate = useNavigate(); // <-- initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === "login") {
      console.log("Login Data:", {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
      });
    } else {
      console.log("Signup Data:", {
        age: formData.age,
        fullName: formData.fullName,
        gender: formData.gender,
        address: formData.address,
        height: formData.height,
        weight: formData.weight,
        diseases: formData.diseases,
      });
    }

    // Redirect to patient dashboard after login/signup
    navigate("/Patient-Dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0fdfa]">
      <div className="w-full max-w-md bg-[#e0f7f4] shadow-lg rounded-2xl p-8">
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === "login"
                ? "bg-teal-600 text-white shadow"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`ml-3 px-6 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === "signup"
                ? "bg-teal-600 text-white shadow"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2">
          {activeTab === "login" ? "Welcome Back" : "Create Patient Account"}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {activeTab === "login"
            ? "Sign in to your patient account"
            : "Fill in the details to sign up"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "login" && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
                required
              />
            </>
          )}

          {activeTab === "signup" && (
            <>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
                required
              />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
                required
              />
              <input
                type="text"
                name="height"
                placeholder="Height (e.g., 5.8 ft)"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
                required
              />
              <input
                type="text"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
                required
              />
              <textarea
                name="diseases"
                placeholder="Uncured Diseases (if any)"
                value={formData.diseases}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-300"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
          >
            {activeTab === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
