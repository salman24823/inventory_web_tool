"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input, RadioGroup, Radio } from "@heroui/react";

export function PartyInput({
  name,
  setName,
  phone,
  setPhone,
  issueDate,
  setIssueDate,
  deadline,
  setDeadline,
  transactionType,
  setTransactionType,
  partyNames,
}) {
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setName(value);
    setIsDropdownOpen(true);
    setSuggestions(
      partyNames.filter((party) => party.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleSuggestionClick = (party) => {
    setName(party);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative" ref={dropdownRef}>
        <Input
          label="Party Name"
          value={name}
          onChange={handleChange}
          onFocus={() => setIsDropdownOpen(true)}
          required
        />
        {isDropdownOpen && suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
            {suggestions.map((party, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(party)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {party}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Input
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <Input
        label="Issue Date"
        type="date"
        value={issueDate}
        onChange={(e) => setIssueDate(e.target.value)}
        required
      />

      <Input
        label="Deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <RadioGroup
        orientation="horizontal"
        value={transactionType}
        onValueChange={setTransactionType}
        label="Transaction Type"
      >
        <Radio value="Cash">Cash</Radio>
        <Radio value="Bank">Bank</Radio>
      </RadioGroup>
    </div>
  );
}