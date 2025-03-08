import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Get attendance record for a student on a specific date
const getAttendanceRecord = (student, date) => {
  return (
    student.attendance?.find((record) => record.date === date) || {
      status: "Absent",
      remark: "",
    }
  );
};

// Function to export as Excel
const downloadExcel = (attendanceData, filteredDates) => {
  const wsData = [
    ["Student Name", ...filteredDates.map((date) => formatDate(date))],
    ...attendanceData.map((student) => [
      student.student_name,
      ...filteredDates.map((date) => {
        const record = getAttendanceRecord(student, date);
        return record.status || "N/A";
      }),
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");
  XLSX.writeFile(wb, "Attendance.xlsx");
};

// Function to export as PDF
const downloadPDF = (attendanceData, filteredDates,batchInfo) => {
  const doc = new jsPDF();
  doc.text(`Attendance Report of ${batchInfo.name}`, 14, 10);

  const tableColumn = ["Student Name", ...filteredDates.map((date) => formatDate(date))];
  const tableRows = attendanceData.map((student) => [
    student.student_name,
    ...filteredDates.map((date) => {
      const record = getAttendanceRecord(student, date);
      return record.status || "N/A";
    }),
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("Attendance.pdf");
};

const ExportButton = ({ attendanceData, filteredDates,batchInfo }) => {
  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <Button variant="outlined" className="flex items-center gap-2" color="blue-gray">
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem className="flex items-center gap-2" onClick={() => downloadPDF(attendanceData, filteredDates,batchInfo)}>
          <DocumentTextIcon className="h-4 w-4" />
          <span>PDF</span>
        </MenuItem>
        <MenuItem className="flex items-center gap-2" onClick={() => downloadExcel(attendanceData, filteredDates)}>
          <TableCellsIcon className="h-4 w-4" />
          <span>Excel</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ExportButton;