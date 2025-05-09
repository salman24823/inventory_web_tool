"use client";

import { Button } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const PO = () => {
  const [name, setName] = useState("");
  const [pos, setPOs] = useState([]);

  const fetchPOs = async () => {
    try {
      const res = await fetch("/api/handlePO");
      const data = await res.json();
      if (res.ok) {
        setPOs(data.pos);
      } else {
        toast.error(data.error || "Failed to fetch POs");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/handlePO", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.message || "Something went wrong");
      } else {
        toast.success("PO added successfully!");
        setName("");
        fetchPOs(); // Refresh the table
      }
    } catch (err) {
      toast.error("Failed to add data");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this PO?")) return;

    try {
      const res = await fetch("/api/handlePO", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("PO deleted");
        fetchPOs(); // Refresh the table
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch (err) {
      toast.error("Error deleting PO");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add PO</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="PO #"
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

      {/* PO Table */}
      <h3 className="text-xl font-semibold mt-12 mb-4 text-gray-800">
        PO List
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pos.map((po, index) => (
              <tr key={po._id} className="hover:bg-gray-50 transition">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{po.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button
                    onPress={() => handleDelete(po._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {pos.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No POs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PO;
