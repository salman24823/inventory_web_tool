import React from "react";
import Cards from "./dashboardComp/cards/page";
import LineChart from "./dashboardComp/LineChart/page";
import PieChart from "./dashboardComp/PieChart/page";
import CustomerTable from "./dashboardComp/Tables/CustomerTable/page";
import EmployeeTable from "./dashboardComp/Tables/EmployeeTable/page";

const Dashboard = () => {
  return (
    <div className="space-y-4">
      
      <Cards />

      {/* charts */}
      <div className="grid grid-cols-4 h-[400px] gap-4">
        <div className="h-full col-span-3">
          <LineChart />
        </div>

        <div className="h-full col-span-1">
          <PieChart />
        </div>
      </div>

      {/* tables */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <CustomerTable />
        </div>
        <div className="col-span-1">
          <EmployeeTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
