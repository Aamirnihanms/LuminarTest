import React from 'react';
import { Card, Typography } from '@material-tailwind/react';

const AttendanceTableSkeleton = ({ columnCount = 7 }) => {
  // Generate array of dates for columns (default to 7 if not specified)
  const dateColumns = Array.from({ length: columnCount }, (_, i) => i);
  
  // Generate array for student rows (showing 5 skeleton rows)
  const studentRows = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="p-4">
      <Card className="w-full overflow-hidden animate-pulse">
        {/* Header Section */}
        <div className="p-4 bg-white border-b">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-gray-200 rounded w-40"></div>
            <div className="w-64 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Table Section */}
        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left border-r">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </th>
                {dateColumns.map((column) => (
                  <th key={`header-${column}`} className="px-3 py-2 text-center">
                    <div className="h-4 bg-gray-200 rounded mx-auto w-16"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentRows.map((row) => (
                <tr key={`row-${row}`}>
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap border-r">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                  </td>
                  {dateColumns.map((column) => (
                    <td key={`cell-${row}-${column}`} className="px-3 py-2 text-center">
                      <div className="flex justify-center">
                        <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceTableSkeleton;