import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Input,
  Button,
  Tooltip
} from '@material-tailwind/react';
import { fetchAttendanceApi } from '@/services/userApi';
import { MagnifyingGlassIcon, CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import AttendanceTableSkeleton from '@/skeletons/AttendanceTableSkeleton ';
import AttendanceRemarkDialog from './AttendanceRemarkDialog';
import DateFilterDialog from './DateFilterDialog';

const AttendanceTable = ({ batchDataDetails, setParentLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentRemark, setCurrentRemark] = useState({ student: null, date: null, remark: "", status: "" });
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    const fetchAttendanceData = async () => {
      setLoading(true);

      try {
        const data = await fetchAttendanceApi(attendanceBatchDataId); 
        setBatchData(data);
        const dates = extractDatesFromData(data);
        setAvailableDates(dates);
        setFilteredDates(dates);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
        if (setParentLoading) setParentLoading(false);
      }
    };

    fetchAttendanceData();
  }, [batchDataDetails, setParentLoading]);


  const extractDatesFromData = (data) => {
    if (!data || !data.attendance) return [];
    
    const allDates = new Set();
    
    data.attendance.forEach(student => {
      student.attendance.forEach(record => {
        allDates.add(record.date);
      });
    });
    

    const sortedDates = Array.from(allDates).sort((a, b) => new Date(b) - new Date(a));
    

    if (!startDate && sortedDates.length > 0) {
      setStartDate(sortedDates[sortedDates.length - 1]);
    }
    if (!endDate && sortedDates.length > 0) {
      setEndDate(sortedDates[0]); 
    }
    
    return sortedDates;
  };

 
  const handleApplyDateFilter = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    
    if (!start || !end) {
      setFilteredDates(availableDates);
      return;
    }

    const filteredDates = availableDates.filter(date => {
      const currentDate = new Date(date);
      return currentDate >= new Date(start) && currentDate <= new Date(end);
    });

    setFilteredDates(filteredDates);
  };


  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredDates(availableDates);
  };

  const handleStatusToggle = (student, date, currentStatus) => {
    const newStatus = currentStatus === "present" ? "absent" : "present";

    if (newStatus === "absent" || currentStatus === "absent") {
      setCurrentRemark({
        student,
        date,
        status: newStatus,
        remark: currentStatus === "absent" ? getAttendanceRecord(student, date).remark : ""
      });
      setIsEditOpen(true);
    } else {
      updateAttendanceRecord(student, date, newStatus, "");
    }
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
      <Tooltip content={status === "absent" ? `${status}: ${remark || "No remark"}` : status}>
        <div
          className={classes}
          onClick={() => handleStatusToggle(student, date, status)}
        >
          {status === "unavailable" ? "Mark" : status}
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
          {(startDate || endDate) && (
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
                Clear
              </Button>
            </div>
          )}
        </div>

        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                  Student Name
                </th>
                {filteredDates.map(date => (
                  <th key={date} className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    {formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map(student => (
                <tr key={student.student_id}>
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                    {student.student_name}
                  </td>
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