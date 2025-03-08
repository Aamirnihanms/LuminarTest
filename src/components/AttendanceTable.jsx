import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Input,
  Button,
  Tooltip,
  Alert
} from '@material-tailwind/react';
import { fetchAttendanceApi } from '@/services/userApi';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  FunnelIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import AttendanceTableSkeleton from '@/skeletons/AttendanceTableSkeleton ';
import AttendanceRemarkDialog from './AttendanceRemarkDialog';
import DateFilterDialog from './DateFilterDialog';
import ControlledSpeedDial from '../utils/SpeedDial';
import ExportButton from '@/utils/Export';

const AttendanceTable = ({ batchDataDetails, setParentLoading, batchName }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentRemark, setCurrentRemark] = useState({ student: null, date: null, remark: "", status: "",location: "" });
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noDataForRange, setNoDataForRange] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const getDefaultEndDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  };
  
  const getDefaultStartDate = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return thirtyDaysAgo.toISOString().split('T')[0]; 
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [availableDates, setAvailableDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!batchDataDetails || !batchDataDetails._id) {
      setError("Batch data details missing");
      setLoading(false);
      if (setParentLoading) setParentLoading(false);
      return;
    }

    const attendanceBatchDataId = batchDataDetails._id;
    fetchAttendanceData(attendanceBatchDataId, startDate, endDate);
  }, [batchDataDetails, startDate, endDate, setParentLoading]);

  const fetchAttendanceData = async (batchId, fromDate, toDate) => {
    setLoading(true);
    setNoDataForRange(false);
    setErrorMessage("");

    try {
      const data = await fetchAttendanceApi(batchId, fromDate, toDate);
      setBatchData(data);
      console.log("test 2",data);
      const dates = extractDatesFromData(data);
      
      if (dates.length === 0) {
        setNoDataForRange(true);
      }
      
      setAvailableDates(dates);
      setFilteredDates(dates);
    } catch (err) {
      console.error("Error fetching data:", err);
      
      if (err.response && err.response.data && err.response.data.error) {
        const errorMsg = err.response.data.error;
        if (errorMsg.includes("No attendance records found for batch ID")) {
          setNoDataForRange(true);
          setErrorMessage(errorMsg);
        } else {
          setError("Failed to fetch data.");
        }
      } else if (err.message && err.message.includes("No attendance records found")) {
        setNoDataForRange(true);
        setErrorMessage(err.message);
      } else {
        setError("Failed to fetch data.");
      }
    } finally {
      setLoading(false);
      if (setParentLoading) setParentLoading(false);
    }
  };

  const extractDatesFromData = (data) => {
    if (!data || !data.attendance) return [];

    const allDates = new Set();

    data.attendance.forEach(student => {
      if (student.attendance && Array.isArray(student.attendance)) {
        student.attendance.forEach(record => {
          if (record && record.date) {
            allDates.add(record.date);
          }
        });
      }
    });

    
    return Array.from(allDates).sort((a, b) => new Date(b) - new Date(a));
  };

  const handleApplyDateFilter = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    
  };

  const resetDateFilter = () => {
    setStartDate(getDefaultStartDate());
    setEndDate(getDefaultEndDate());
  };

  const handleStatusToggle = (student, date, currentStatus) => {
    const attendanceRecord = getAttendanceRecord(student, date);
    setCurrentRemark({
      student,
      date,
      status: currentStatus, 
      remark: currentStatus === "absent" ? attendanceRecord.remark : "No remark",
      location: attendanceRecord.location || "No data" 
    });
    setIsEditOpen(true);
  };

  const updateAttendanceRecord = (student, date, status, remark) => {
    setBatchData(prevData => {
      if (!prevData) return prevData;

      const newData = { ...prevData };
      const studentData = newData.attendance.find(s => s.student_id === student.student_id);

      if (!studentData) return newData;

      let attendance = studentData.attendance.find(a => a.date === date);
      if (attendance) {
        attendance.status = status;
        attendance.remark = remark;
      } else {
        studentData.attendance.push({
          date,
          status,
          remark
        });
        studentData.attendance.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      return newData;
    });
  };

  const handleSaveRemark = (updatedRemark) => {
    updateAttendanceRecord(
      updatedRemark.student,
      updatedRemark.date,
      updatedRemark.status,
      updatedRemark.remark
    );
    setIsEditOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const StatusDisplay = ({ student, date, status, remark }) => {
    let classes = "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium cursor-pointer w-full mx-auto ";

    const statusDisplayMap = {
      present: "Present",
      absent: "Absent",
      unavailable: "Unavailable"
    };

    const displayStatus = statusDisplayMap[status] || "Unavailable";

    switch (status) {
      case "present":
        classes += "bg-green-100 text-green-800 hover:bg-green-200";
        break;
      case "absent":
        classes += "bg-red-100 text-red-800 hover:bg-red-200";
        break;
      default:
        classes += "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }

    return (
      <Tooltip content={status === "absent" ? `${displayStatus}: ${remark || "No remark"}` : displayStatus}>
        <div
          className={classes}
          onClick={() => handleStatusToggle(student, date, status)}
        >
          {displayStatus === "Unavailable" ? "Mark" : displayStatus}
        </div>
      </Tooltip>
    );
  };

  const getAttendanceRecord = (student, date) => {
    return student.attendance.find(r => r.date === date) || {
      status: "unavailable",
      remark: ""
    };
  };

  if (loading) return <AttendanceTableSkeleton />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!batchData || !batchData.attendance) return <div className="p-4">No attendance data available</div>;

  const filteredStudents = batchData.attendance.filter(student =>
    student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <Card className="w-full overflow-hidden">
        <div className="p-4 bg-white border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              Attendance
            </Typography>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Date filter button */}
              <Button
                variant="outlined"
                className="flex items-center gap-2"
                onClick={() => setIsFilterOpen(true)}
                color="blue-gray"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Date Filter</span>
                <FunnelIcon className="h-4 w-4" />
              </Button>

              {/* Export Button Component */}
              <ExportButton 
                attendanceData={filteredStudents} 
                filteredDates={filteredDates} 
                batchInfo={batchDataDetails}
              />

              {/* Search input */}
              <div className="w-full md:w-64">
                <Input
                  label="Search Students"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-full"
                />
              </div>
            </div>
          </div>

          {/* Show active filter indication */}
          <div className="flex items-center gap-2 text-sm text-blue-gray-600 mb-2">
            <CalendarIcon className="h-4 w-4" />
            <span>
              Showing dates: {startDate ? formatDate(startDate) : "Start"} - {endDate ? formatDate(endDate) : "End"}
            </span>
            <Button
              variant="text"
              size="sm"
              color="red"
              className="p-1 h-6"
              onClick={resetDateFilter}
            >
              Reset to Default
            </Button>
          </div>
          
          {/* No data alert with specific error message if available */}
          {noDataForRange && (
            <Alert
              color="amber"
              icon={<ExclamationTriangleIcon className="h-5 w-5" />}
              className="mt-2"
            >
              {"No attendance data found for the selected date range. Try adjusting the dates or resetting to default."}
            </Alert>
          )}
        </div>

        <div className="relative overflow-hidden max-h-[600px]">
          <div className="overflow-auto max-h-[600px]">
            {noDataForRange ? (
              <div className="p-8 text-center text-gray-500">
                {/* <Typography variant="h6">No attendance records found</Typography>
                <Typography variant="paragraph" className="mt-2"> */}
                  {/* {"No data available for the selected date range. Please adjust the date filter."} */}
                {/* </Typography> */}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky top-0 left-0 z-30 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-b">
                      Student Name
                    </th>
                
                    {filteredDates.map(date => (
                      <th
                        key={date}
                        className="sticky top-0 z-20 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center border-b"
                      >
                        {formatDate(date)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <tr key={student.student_id}>
                      {/* This cell is sticky horizontally */}
                      <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                        {student.student_name}
                      </td>
                      {/* Regular cells */}
                      {filteredDates.map(date => {
                        const record = getAttendanceRecord(student, date);
                        return (
                          <td key={`${student.student_id}-${date}`} className="px-3 py-2 text-center">
                            <div className="flex justify-center">
                              <StatusDisplay
                                student={student}
                                date={date}
                                status={record.status}
                                remark={record.remark}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
            <ControlledSpeedDial batchId={batchDataDetails._id} />
        </div>
      </Card>

      {/* Remark Dialog - Extracted to separate component */}
      <AttendanceRemarkDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveRemark}
        remarkData={currentRemark}
        formatDate={formatDate}
      />

      {/* Date Filter Dialog - Extracted to separate component */}
      <DateFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyDateFilter}
        onReset={resetDateFilter}
        startDate={startDate}
        endDate={endDate}
        availableDates={availableDates}
      />
    </div>
  );
};

export default AttendanceTable;