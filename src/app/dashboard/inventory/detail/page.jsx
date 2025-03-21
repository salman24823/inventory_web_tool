import React from "react";

const Detail = ({ Stocks }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl w-full">
      {/* Header Section */}
      <div className="bg-gray-200 w-full p-4 rounded-t-lg">
        <h2 className="text-gray-700 text-lg font-semibold">Stock Detail :</h2>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Stock Title</h2>
            <p className="text-gray-600">Title</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Stock Status</h2>
            <p className="text-green-600 font-medium">Available</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">

            <div className="grid grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Stock Quantity</h2>
                <p className="text-gray-600">100 Meter</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Stock Quality</h2>
                <p className="text-gray-600">100% Pure Cotton</p>
              </div>
            </div>

          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Cost</h2>
                <p className="text-gray-600">12000 PKR</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Cost Per Unit</h2>
                <p className="text-gray-600">1000 PKR</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Amount Paid</h2>
                <p className="text-gray-600">12000 PKR</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Remaining Amount</h2>
                <p className="text-gray-600">0 PKR</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 border-l border-gray-200 pl-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full inline-block">
                {/* Placeholder for company logo */}
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800 mt-3">Company Name</h1>
              <p className="text-gray-600">Lorem Ipsum</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Company Phone</h2>
            <p className="text-gray-600">+123 456 7890</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Payment Issue Date</h2>
            <p className="text-gray-600">12/2/2025</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Payment Status</h2>
            <p className="text-green-600 font-medium">Paid</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Payment Deadline</h2>
            <p className="text-gray-600">12/23/2025</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Detail;