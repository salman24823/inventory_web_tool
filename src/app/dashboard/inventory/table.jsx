import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from "@heroui/react";
import Detail from "./detail";
import { PlusCircleIcon, X } from "lucide-react";

const TableComp = ({ stocks, handleDeleteClick }) => {
    return (
        <div>
            <Button onPress={() => console.log(stocks, "Stocks")} >Console</Button>
            <Table className="overflow-x-scroll text-nowrap custom-scrollbar" aria-label="Stock analysis table">
                <TableHeader>
                    <TableColumn>#</TableColumn>
                    <TableColumn className="min-w-36">PO NUMBER</TableColumn>
                    <TableColumn className="min-w-40">CLOTH QUALITY</TableColumn>
                    <TableColumn className="min-w-36">STATUS</TableColumn>
                    <TableColumn className="min-w-36">QUANTITY</TableColumn>
                    <TableColumn>ACTION</TableColumn>
                </TableHeader>

                <TableBody keek emptyContent="No Stocks Found">
                    {stocks.map((stock, index) => (
                        <TableRow
                            className="hover:bg-gray-100"
                            key={stock._id}
                        >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{stock.purchaseOrderNumber}</TableCell>
                            <TableCell className="text-nowrap">
                                <p className="text-sm text-gray-500">{stock.clothQuality}</p>
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`px-4 text-xs py-1 rounded-full ${stock.grayClothQuantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {stock.grayClothQuantity > 0 ? "In-Stock" : "Out-of-Stock"}
                                </span>
                            </TableCell>
                            <TableCell>
                                <p className="text-sm text-gray-700">
                                    <span className="text-black font-semibold">{stock.stockQuantity || 0}</span> {stock.unitType}
                                </p>
                            </TableCell>
                            <TableCell className="text-nowrap">
                                <div className="flex gap-3 items-center">
                                    <Detail stock={stock} />
                                    <PlusCircleIcon
                                        className="text-green-600 hover:cursor-pointer"
                                    />
                                    <X
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(stock);
                                        }}
                                        className="text-red-600 hover:cursor-pointer"
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableComp;