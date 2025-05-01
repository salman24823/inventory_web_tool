"use client";

import { Button } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Factory = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [factories, setFactories] = useState([]);

  const fetchFactories = async () => {
    try {
      const res = await fetch("/api/handleFactory");
      const data = await res.json();
      if (res.ok) {
        setFactories(data.factories);
      } else {
        toast.error(data.error || "Failed to fetch factories");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFactories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/handleFactory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.message || "Something went wrong");
      } else {
        toast.success("Factory added successfully!");
        setName("");
        setPhone("");
        fetchFactories(); // Refresh the table
      }
    } catch (err) {
      toast.error("Failed to add data");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this factory?")) return;

    try {
      const res = await fetch("/api/handleFactory", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Factory deleted");
        fetchFactories(); // Refresh the table
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch (err) {
      toast.error("Error deleting factory");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Factory</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Factory name"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone number"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      {/* Factory Table */}
      <h3 className="text-xl font-semibold mt-12 mb-4 text-gray-800">
        Factory List
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {factories.map((factory, index) => (
              <tr key={factory._id} className="hover:bg-gray-50 transition">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{factory.name}</td>
                <td className="border border-gray-300 px-4 py-2">{factory.phone}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button
                    onClick={() => handleDelete(factory._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {factories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No factories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Factory;
