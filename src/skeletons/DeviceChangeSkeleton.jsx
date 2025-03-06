import React from "react";
import { Card, CardHeader, CardBody,  } from "@material-tailwind/react";

const DeviceChangePageSkeleton = ({ rowCount = 5, columnCount = 6 }) => {
  return (
   <div className="mt-12 mb-8 flex flex-col gap-8">
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {["Employee", "Current Device", "Requested Device", "Request Date", "Status", "Actions"].map((_, index) => (
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
  
                          // Special treatment for Status column
                          if (colIndex === 4) {
                            return (
                              <td key={colIndex} className={classes}>
                                <div className="w-max">
                                  <div className="h-6 w-16 animate-pulse rounded-full bg-amber-100"></div>
                                </div>
                              </td>
                            );
                          }
                          
                          // Special treatment for Actions column
                          if (colIndex === 5) {
                            return (
                              <td key={colIndex} className={classes}>
                                <div className="flex gap-2">
                                  <div className="h-8 w-16 animate-pulse rounded-md bg-green-100"></div>
                                  <div className="h-8 w-16 animate-pulse rounded-md bg-red-100"></div>
                                </div>
                              </td>
                            );
                          }
  
                          // Vary the width of skeleton elements to make it look more natural
                          const widthClass = colIndex === 0 
                            ? "w-32" 
                            : colIndex === 1 || colIndex === 2
                              ? "w-40" 
                              : colIndex === 3
                                ? "w-28" 
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
   </div>
  );
};

export default DeviceChangePageSkeleton ;