import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

const TableSkeleton = ({ rowCount = 5, columnCount = 8 }) => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader variant="gradient" color="purple" className="mb-8 p-6">
        <div className="h-6 w-48 animate-pulse rounded-md bg-white/30"></div>
      </CardHeader>

      <CardBody className="px-4">
        {/* Search bar skeleton */}
        <div className="mb-4 w-72">
          <div className="h-10 w-full animate-pulse rounded-md bg-gray-200"></div>
        </div>

        {/* Table skeleton */}
        <div className="">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {Array(columnCount)
                  .fill(0)
                  .map((_, index) => (
                    <th key={index} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <div className="h-4 w-24 animate-pulse rounded-md bg-blue-gray-200"></div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Array(rowCount)
                .fill(0)
                .map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array(columnCount)
                      .fill(0)
                      .map((_, colIndex) => {
                        const isLast = rowIndex === rowCount - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";

                        // Vary the width of skeleton elements to make it look more natural
                        const widthClass = colIndex === 0 
                          ? "w-32" 
                          : colIndex === 1 
                            ? "w-40" 
                            : colIndex === columnCount - 1 
                              ? "w-20" 
                              : "w-24";

                        return (
                          <td key={colIndex} className={classes}>
                            <div className={`h-4 ${widthClass} animate-pulse rounded-md bg-gray-200`}></div>
                          </td>
                        );
                      })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};

export default TableSkeleton;