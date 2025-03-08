import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  Input,
  IconButton,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import DeviceChangePageSkeleton from "@/skeletons/DeviceChangeSkeleton";
import { ApproveDeviceChangeApi, fetchDeviceChangeApi, disaApproveDeviceChangeApi } from "@/services/userApi";

function DeviceChangePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchData = async (page, size) => {
    setIsLoading(true);
    try {
      const result = await fetchDeviceChangeApi(page, size);
      setStudents(result.results.data);
      
      if (result.count !== undefined) {
        setTotalItems(result.count);
        setTotalPages(Math.ceil(result.count / size));
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageSizeChange = (value) => {
    const newSize = parseInt(value);
    setPageSize(newSize);
    setCurrentPage(1); 
  };

  const handleApprove = async (studentId) => {
    try {
      const result = await ApproveDeviceChangeApi(studentId);
  
      if (result.data.approved === true) { 
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === studentId ? { ...student, approved: true } : student
          )
        );
        
      } else {
        console.error("Approval failed:", result.message);
      }
    } catch (error) {
      console.error("Error approving device change:", error);
    }
  };
  
  const openDeleteConfirm = (student) => {
    setStudentToDelete(student);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setStudentToDelete(null);
  };

  const handleDelete = async (studentId) => {
    try {
      const result = await disaApproveDeviceChangeApi(studentId);
  
      if (result.message === "Device change request deleted successfully." || result.status === 200) {
        // Remove the item from the students array instead of marking it as deleted
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== studentId)
        );
        closeDeleteConfirm();
        if (isModalOpen && selectedStudent && selectedStudent.id === studentId) {
          setIsModalOpen(false);
        }
      } else {
        console.error("Deletion failed:", result.message);
      }
    } catch (error) {
      console.log("Error deleting device change:", error);
    } finally {
      closeDeleteConfirm();
    }
  };
   
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (student) => {
    if (student.approved) return "green";
    return "amber";
  };

  const getStatusText = (student) => {
    if (student.approved) return "approved";
    return "pending";
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete Confirmation Dialog
  const DeleteConfirmationDialog = () => {
    if (!studentToDelete) return null;
    
    return (
      <Dialog open={deleteConfirmOpen} handler={closeDeleteConfirm}>
        <DialogHeader className="flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
          <Typography variant="h5">Confirm Deletion</Typography>
        </DialogHeader>
        <DialogBody>
          <Typography className="text-center mb-2">
            Are you sure you want to delete the device change request for:
          </Typography>
          <div className="bg-blue-gray-50 p-4 rounded-lg mb-4">
            <Typography variant="h6" className="text-center">{studentToDelete.name}</Typography>
            <div className="flex justify-center gap-x-4 mt-2 text-sm text-blue-gray-700">
              <span>Email: {studentToDelete.email}</span>
            </div>
          </div>
          <Typography color="red" className="font-medium text-center">
            This action cannot be undone.
          </Typography>
        </DialogBody>
        <DialogFooter className="flex justify-center gap-3">
          <Button variant="outlined" color="blue-gray" onClick={closeDeleteConfirm}>
            Cancel
          </Button>
          <Button color="red" onClick={() => handleDelete(studentToDelete.id)}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    );
  };

  // Modal
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
              {/* <Typography variant="small" color="blue-gray" className="font-semibold">
                Student ID:
              </Typography>
              <Typography variant="paragraph">{studentData.student_id}</Typography> */}
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                Email:
              </Typography>
              <Typography variant="paragraph">{studentData.email}</Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                Phone Number:
              </Typography>
              <Typography variant="paragraph">{studentData.phone || "Not provided"}</Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                Created At:
              </Typography>
              <Typography variant="paragraph">{formatDate(studentData.created_at)}</Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                Remarks:
              </Typography>
              <Typography variant="paragraph" className="whitespace-pre-wrap">
                {studentData.remark || "No remarks available"}
              </Typography>
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
            {!studentData.approved && (
              <>
                <Button
                  color="red"
                  onClick={() => {
                    handleClose();
                    openDeleteConfirm(studentData);
                  }}
                >
                  Delete
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

  if (isLoading) return <DeviceChangePageSkeleton />
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
          <div className="mb-4 flex w-full justify-between items-center">
            <div className="w-full md:w-72">
              <Input
                label="Search students"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select label="Items per page" value={pageSize.toString()} onChange={handlePageSizeChange}>
                <Option value="5">5 per page</Option>
                <Option value="10">10 per page</Option>
                <Option value="25">25 per page</Option>
                <Option value="50">50 per page</Option>
              </Select>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="overflow-auto max-h-[400px]">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {["Name", "Email", "Created Date", "Status", "Actions"].map((head) => (
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
                          {/* <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {student.student_id}
                            </Typography>
                          </td> */}
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
                              {!student.approved && (
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
                                      openDeleteConfirm(student);
                                    }}
                                  >
                                    Delete
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
                          {students.length === 0 ? "Currently no request available" : "No matching students found"}
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography variant="small" color="blue-gray" className="font-normal">
              Page {currentPage} of {totalPages} ({totalItems} total items)
            </Typography>
            <div className="flex gap-2">
              <IconButton 
                variant="outlined" 
                color="blue-gray" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
              <IconButton 
                variant="outlined" 
                color="blue-gray" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog />
    </div>
  );
}

export default DeviceChangePage;