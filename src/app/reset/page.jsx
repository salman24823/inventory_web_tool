"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const validateStep = (step) => {
    const fields = {
      1: ["name"],
      2: ["email"],
      3: ["phone"],
      4: ["newPassword"],
    }[step];

    let isValid = true;
    fields.forEach((field) => {
      if (!formData[field]) {
        toast.error(`${field.replace(/([A-Z])/g, " $1")} is required!`);
        isValid = false;
      }
    });
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      const response = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Invalid credentials");

      toast.success("Password successfully updated!");
      setCurrentStep(5);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Password Reset</h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                    currentStep >= step ? "text-blue-600 bg-blue-200" : "text-gray-500 bg-gray-200"
                  }`}
                >
                  Step {step}
                </span>
              ))}
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                id="progress-bar"
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Steps */}
          <form id="multi-step-form" onSubmit={handleSubmit}>
            {/* Step 1: name */}
            <div id="step-1" className={`step ${currentStep !== 1 ? "hidden" : ""}`}>
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            {/* Step 2: Email */}
            <div id="step-2" className={`step ${currentStep !== 2 ? "hidden" : ""}`}>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Step 3: Phone Number */}
            <div id="step-3" className={`step ${currentStep !== 3 ? "hidden" : ""}`}>
              <div className="mb-6">
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Step 4: New Password */}
            <div id="step-4" className={`step ${currentStep !== 4 ? "hidden" : ""}`}>
              <div className="mb-6">
                <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter a new password"
                  required
                />
              </div>
            </div>

            {/* Step 5: Success Message */}
            <div id="step-5" className={`step ${currentStep !== 5 ? "hidden" : ""}`}>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Password Changed!</h2>
                <p className="text-gray-700">Your password has been successfully updated.</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrev}
                className={`px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:shadow-outline ${
                  currentStep === 1 ? "hidden" : ""
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline ${
                  currentStep === 5 || currentStep === 4 ? "hidden" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Next"}
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:shadow-outline ${
                  currentStep !== 4 ? "hidden" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;