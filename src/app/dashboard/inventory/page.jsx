"use client";

import React, { useEffect, useState } from "react";
import useGlobalStore from "@/app/store/globalstore";
import TableComp from "./table";
import Filters from "./filters";

export default function Stock() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedPO, setSelectedPO] = useState("All PO Numbers");
  const [selectedFactory, setSelectedFactory] = useState("All Factories");
  const { fetchFactoryName, fetchPONumber, factories, poNumbers } = useGlobalStore();
  const [stocks, setStocks] = useState([]);

  async function fetchStocks() {
    try {
      const response = await fetch("/api/handleStock", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setStocks(data);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  }

  async function handleDeleteClick(stock) {
    try {
      const response = await fetch(`/api/handleStock?_id=${stock._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        alert(`Deleted stock for ${stock.purchaseOrderNumber}`);
        fetchStocks(); // Refresh stocks after deletion
      } else {
        alert("Failed to delete stock");
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
      alert("Error deleting stock");
    }
  }

  useEffect(() => {
    fetchFactoryName();
    fetchPONumber();
    fetchStocks();
  }, [fetchFactoryName, fetchPONumber]);

  const filteredStocks = stocks.filter((stock) => {
    const stockStatus = stock.grayClothQuantity > 0 ? "In-Stock" : "Out-of-Stock";
    const matchesStatus = selectedFilter === "All" || stockStatus === selectedFilter;
    const matchesPO = selectedPO === "All PO Numbers" || stock.purchaseOrderNumber === selectedPO;
    const matchesFactory = selectedFactory === "All Factories" || stock.factoryName === selectedFactory;

    // Month and Year filtering
    const issueDate = new Date(stock.issueDate);
    const stockMonth = issueDate.toLocaleString("default", { month: "long" });
    const stockYear = issueDate.getFullYear().toString();
    const matchesMonth = selectedMonth === "Select Month" || stockMonth === selectedMonth;
    const matchesYear = selectedYear === "Select Year" || stockYear === selectedYear;

    return matchesStatus && matchesPO && matchesFactory && matchesMonth && matchesYear;
  });

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="shadow-small payment-filter flex flex-col gap-3 w-full p-4 bg-white">
        <h2 className="text-medium text-gray-700 font-normal">Select Filter:</h2>
        <Filters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedPO={selectedPO}
          setSelectedPO={setSelectedPO}
          selectedFactory={selectedFactory}
          setSelectedFactory={setSelectedFactory}
          poNumbers={poNumbers}
          factories={factories}
          fetchStocks={fetchStocks}
        />
      </div>

      <TableComp
        stocks={filteredStocks}
        handleDeleteClick={handleDeleteClick}
      />
    </section>
  );
}