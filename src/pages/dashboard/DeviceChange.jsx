import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  Input
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DeviceChangePageSkeleton from "@/skeletons/DeviceChangeSkeleton";
import { fetchDeviceChangeApi } from "@/services/userApi";


function DeviceChangePage () {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
     const fetchData = async () =>{
      try {
        const result = await fetchDeviceChangeApi();
        setStudents(result.data)
      } catch (error) {
        setError(error)
      }finally{
        setIsLoading(false)
      }
     }

    fetchData()
  }, []);

  const handleApprove = (studentId) => {
    setStudents(
      students.map(student => 
        student.id === studentId 
          ? { ...student, approved: true } 
          : student
      )
    );
  };

  const handleReject = (studentId) => {
    setStudents(
      students.map(student => 
        student.id === studentId 
          ? { ...student, is_deleted: true } 
          : student
      )
    );
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (student) => {
    if (student.is_deleted) return "red";
    if (student.approved) return "green";
    return "amber";
  };

  const getStatusText = (student) => {
    if (student.is_deleted) return "rejected";
    if (student.approved) return "approved";
    return "pending";
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal component for student details
  const StudentDetailModal = ({ isOpen, handleClose, studentData }) => {
    if (!isOpen || !studentData) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Student Details
          </Typography>
          <div className="space-y-3">
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                Name:
              </Typography>
              <Typography variant="paragraph">{studentData.name}</Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                Student ID:
              </Typography>
              <Typography variant="paragraph">{studentData.student_id}</Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                Email:
              </Typography>
              <Typography variant="paragraph">{studentData.email}</Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                Created At:
              </Typography>
              <Typography variant="paragraph">{formatDate(studentData.created_at)}</Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                Status:
              </Typography>
              <Chip
                size="sm"
                variant="ghost"
                color={getStatusColor(studentData)}
                value={getStatusText(studentData)}
                className="inline-block w-auto"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            {!studentData.approved && !studentData.is_deleted && (
              <>
                <Button 
                  color="red" 
                  onClick={() => {
                    handleReject(studentData.id);
                    handleClose();
                  }}
                >
                  Reject
                </Button>
                <Button 
                  color="green" 
                  onClick={() => {
                    handleApprove(studentData.id);
                    handleClose();
                  }}
                >
                  Approve
                </Button>
              </>
            )}
            <Button variant="outlined" color="blue-gray" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  };
   
  if(isLoading) return <DeviceChangePageSkeleton/>
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!students) return <div className="p-4">No device change request data available</div>;
  

  return (
    <div className="mt-12 mb-8 flex flex-col gap-8">
        <Card>
          <CardHeader variant="gradient" color="purple" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Student Approval Requests
            </Typography>
          </CardHeader>
          
          <CardBody className="px-4">
            <div className="mb-4 flex w-full flex-col gap-6 md:w-72">
              <Input 
                label="Search students" 
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="overflow-hidden max-h-[400x]">
                <div className="overflow-auto max-h-[400px]">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {["Name", "Student ID", "Email", "Created Date", "Status", "Actions"].map((head) => (
                          <th key={head} className="sticky top-0 z-10 border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                            >
                              {head}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => {
                          const isLast = index === filteredStudents.length - 1;
                          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                          
                          return (
                            <tr 
                              key={student.id} 
                              className="hover:bg-blue-gray-50 cursor-pointer transition-colors"
                              onClick={() => handleViewDetails(student)}
                            >
                              <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                  {student.name}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                  {student.student_id}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                  {student.email}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                  {formatDate(student.created_at)}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <div className="w-max">
                                  <Chip
                                    size="sm"
                                    variant="ghost"
                                    color={getStatusColor(student)}
                                    value={getStatusText(student)}
                                  />
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex gap-2">
                                  {!student.approved && !student.is_deleted && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        color="green"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleApprove(student.id);
                                        }}
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        color="red"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleReject(student.id);
                                        }}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-4 text-center">
                            <Typography variant="small" color="blue-gray">
                              {students.length > 0 ? "No matching students found" : "Loading students..."}
                            </Typography>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          </CardBody>
        </Card>

      {/* Student Detail Modal */}
      <StudentDetailModal 
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        studentData={selectedStudent}
      />
    </div>
  );
}

export default DeviceChangePage;