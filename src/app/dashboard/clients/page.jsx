"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { ChevronUp } from "lucide-react";

export default function CustomerTable() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [customers] = useState([
    {
      id: 1,
      name: "Ali Khan",
      phone: "+92 300 1234567",
      totalPayment: "PKR 15,000",
      pendingAmount: "PKR 0",
      status: "paid",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      phone: "+92 310 9876543",
      totalPayment: "PKR 10,000",
      pendingAmount: "PKR 5,000",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      id: 3,
      name: "Bilal Siddiqui",
      phone: "+92 321 4567890",
      totalPayment: "PKR 20,000",
      pendingAmount: "PKR 20,000",
      status: "overdue",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    },
    {
      id: 4,
      name: "Sana Malik",
      phone: "+92 333 1122334",
      totalPayment: "PKR 12,000",
      pendingAmount: "PKR 0",
      status: "paid",
      avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    },
  ]);

  const filteredCustomers = customers.filter(customer => 
    selectedFilter === "All" ? true : customer.status === selectedFilter.toLowerCase()
  );

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="shadow-small payment-filter flex flex-col gap-3 w-full p-4 bg-[#FFFFFF]">
        <h2>Select Filter</h2>
        <div className="relative">
          <button 
            className="px-3 py-2 rounded-2xl relative drop_button w-40 bg-[#F4F4F5] flex justify-between font-bold"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedFilter}
            <ChevronUp 
              className={`drop_arrow text-gray-500 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDropdown && (
            <div className="payment_dropdown rounded-xl absolute flex flex-col w-44 bg-[#F4F4F5] top-12 left-0 z-10 shadow-md">
              {["All", "PAID", "PENDING", "DUE", "OVERDUE"].map((option) => (
                <span
                  key={option}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-xl"
                  onClick={() => {
                    setSelectedFilter(option);
                    setShowDropdown(false);
                  }}
                >
                  {option}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Table aria-label="Customer analysis table">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>CUSTOMER</TableColumn>
          <TableColumn>TOTAL PAYMENT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>PENDING AMOUNT</TableColumn>
        </TableHeader>

        <TableBody emptyContent="NO CUSTOMERS FOUND">
          {filteredCustomers.map((customer, index) => (
            <TableRow
              key={customer.id}
              className="hover:bg-gray-100 transition-colors"
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{customer.totalPayment}</TableCell>
              <TableCell>
                <span
                  className={`px-4 text-xs py-1 rounded-full font-medium ${
                    customer.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : customer.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {customer.status.toUpperCase()}
                </span>
              </TableCell>
              <TableCell>{customer.pendingAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}





















// "use client";

// import React, { useState } from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Button,
// } from "@heroui/react";
// import { ChevronUp } from "lucide-react";

// export default function CustomerTable() {
//   const [customers] = useState([
//     {
//       id: 1,
//       name: "Ali Khan",
//       phone: "+92 300 1234567",
//       totalPayment: "PKR 15,000",
//       pendingAmount: "PKR 0",
//       status: "paid",
//       avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     },
//     {
//       id: 2,
//       name: "Fatima Ahmed",
//       phone: "+92 310 9876543",
//       totalPayment: "PKR 10,000",
//       pendingAmount: "PKR 5,000",
//       status: "pending",
//       avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
//     },
//     {
//       id: 3,
//       name: "Bilal Siddiqui",
//       phone: "+92 321 4567890",
//       totalPayment: "PKR 20,000",
//       pendingAmount: "PKR 20,000",
//       status: "overdue",
//       avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
//     },
//     {
//       id: 4,
//       name: "Sana Malik",
//       phone: "+92 333 1122334",
//       totalPayment: "PKR 12,000",
//       pendingAmount: "PKR 0",
//       status: "paid",
//       avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
//     },
//   ]);

//   return (
//     <section className="w-full flex flex-col gap-4">
//       <div className="shadow-small payment-filter flex flex-col gap-3 w-full p-4 bg-[#FFFFFF]">
//         <h2>Select Filter</h2>
//         <div>
//           <button className="px-3 py-2  rounded-2xl relative drop_button w-40 bg-[#F4F4F5] flex justify-between font-bold">
//             All <ChevronUp className="drop_arrow text-gray-500" />
//             <span className="payment_dropdown rounded-xl absolute flex flex-col w-44 bg-[#F4F4F5] top-12 left-0 z-10">
//               <span className="px-4 py-2">PAID</span>
//               <span className="px-4 py-2">PENDING</span>
//               <span className="px-4 py-2">DUE</span>
//               <span className="px-4 py-2">OVERDUE</span>
//             </span>
//           </button>
  

//         </div>
//       </div>
//       <Table aria-label="Customer analysis table">
//         <TableHeader>
//           <TableColumn>#</TableColumn>
//           <TableColumn>CUSTOMER</TableColumn>
//           <TableColumn>TOTAL PAYMENT</TableColumn>
//           <TableColumn>STATUS</TableColumn>
//           <TableColumn>PENDING AMOUNT</TableColumn>
//         </TableHeader>

//         <TableBody emptyContent="NO CUSTOMERS FOUND">
//           {customers.map((customer, index) => (
//             <TableRow
//               key={customer.id}
//               className="hover:bg-gray-100 transition-colors"
//             >
//               <TableCell>{index + 1}</TableCell>
//               <TableCell>
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={customer.avatar}
//                     alt={customer.name}
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <div>
//                     <p className="font-bold">{customer.name}</p>
//                     <p className="text-sm text-gray-500">{customer.phone}</p>
//                   </div>
//                 </div>
//               </TableCell>
//               <TableCell>{customer.totalPayment}</TableCell>
//               <TableCell>
//                 <span
//                   className={`px-4 text-xs py-1 rounded-full font-medium ${
//                     customer.status === "paid"
//                       ? "bg-green-100 text-green-700"
//                       : customer.status === "pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {customer.status.toUpperCase()}
//                 </span>
//               </TableCell>

//               <TableCell>{customer.pendingAmount}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </section>
//   );
// }
