import React from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@heroui/react";
import { ChevronDown, X } from "lucide-react";
import Action from "./action";

const Filters = ({
    selectedFilter,
    setSelectedFilter,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    selectedPO,
    setSelectedPO,
    selectedFactory,
    setSelectedFactory,
    poNumbers,
    factories,
    fetchStocks,
}) => {
    return (
        <div className="flex justify-between">
            <div className="relative flex gap-3 items-center flex-wrap">
                {/* Filter by Status */}
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <Button variant="ghost" className="w-40 flex justify-between">
                            {selectedFilter}
                            <ChevronDown className="text-gray-500" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        {["All", "In-Stock", "Out-of-Stock"].map((option) => (
                            <DropdownItem key={option} onPress={() => setSelectedFilter(option)}>
                                {option}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                {/* Filter by Month */}
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <Button variant="ghost" className="w-40 flex justify-between">
                            {selectedMonth}
                            <ChevronDown className="text-gray-500" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        {[
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                        ].map((option) => (
                            <DropdownItem key={option} onPress={() => setSelectedMonth(option)}>
                                {option}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                {/* Filter by Year */}
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <Button variant="ghost" className="w-40 flex justify-between">
                            {selectedYear}
                            <ChevronDown className="text-gray-500" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        {["2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"].map((option) => (
                            <DropdownItem key={option} onPress={() => setSelectedYear(option)}>
                                {option}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                {/* Filter by PO Number */}
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <Button variant="ghost" className="w-48 flex justify-between">
                            {selectedPO}
                            <ChevronDown className="text-gray-500" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        {["All PO Numbers", ...(poNumbers || [])].map((po) => (
                            <DropdownItem key={po} onPress={() => setSelectedPO(po)}>
                                {po}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                {/* Filter by Factory */}
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <Button variant="ghost" className="w-48 flex justify-between">
                            {selectedFactory}
                            <ChevronDown className="text-gray-500" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        {["All Factories", ...(factories || [])].map((factory) => (
                            <DropdownItem key={factory} onPress={() => setSelectedFactory(factory)}>
                                {factory}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                {/* Clear Filters */}
                <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                    onPress={() => {
                        setSelectedFilter("All");
                        setSelectedMonth("Select Month");
                        setSelectedYear("Select Year");
                        setSelectedPO("All PO Numbers");
                        setSelectedFactory("All Factories");
                    }}
                >
                    <X className="w-4 h-4" />
                    Clear Filters
                </Button>
            </div>
            <Action fetchStocks={fetchStocks} poNumbers={poNumbers} factories={factories} />
        </div>
    );
};

export default Filters;