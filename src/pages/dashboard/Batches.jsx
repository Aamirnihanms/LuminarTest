import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography, 
  Input,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Avatar
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TableSkeleton from '@/skeletons/TableSkeleton';
import { useNavigate } from 'react-router-dom';
import QrDisplayPage from './QrWIndow';
import { QrCodeIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { fetchBatchesApi } from '@/services/userApi';


import AttendanceTable from '@/components/AttendanceTable';

const BatchDetailModal = ({ isOpen, handleClose, batchData, onOpenQr, onViewAttendance }) => {
  if (!batchData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleQrClick = () => {
    onOpenQr(batchData);
    handleClose();
  };

  const handleAttendanceClick = () => {
    onViewAttendance(batchData);
    handleClose();
  };

  return (
    <Dialog open={isOpen} handler={handleClose} size="lg">
      <DialogHeader className="flex flex-col items-start">
        <Typography variant="h5" color="blue-gray">
          {batchData.name}
        </Typography>
        <Typography variant="small" color="gray">
          {batchData.course?.name || "No course specified"}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="overflow-y-auto max-h-96">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Schedule Information
              </Typography>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Start Date:</Typography>
                  <Typography variant="small">{formatDate(batchData.startDate)}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">End Date:</Typography>
                  <Typography variant="small">{formatDate(batchData.endDate)}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Duration:</Typography>
                  <Typography variant="small">{batchData.duration || "Not specified"}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Time:</Typography>
                  <Typography variant="small">{batchData.time || "Not specified"}</Typography>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Location & Classroom
              </Typography>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Location:</Typography>
                  <Typography variant="small">{batchData.batchLocation?.label || "Not specified"}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Building:</Typography>
                  <Typography variant="small">{batchData.batchBuilding?.label || "Not specified"}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Classroom:</Typography>
                  <Typography variant="small">{batchData.batchClassroom?.label || "Not specified"}</Typography>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right column */}
          <div className="space-y-4">
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Batch Status
              </Typography>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography variant="small" color="gray">Status:</Typography>
                  <Chip
                    size="sm"
                    variant="ghost"
                    color={
                      batchData.status === "active" 
                        ? "green" 
                        : batchData.status === "completed" 
                          ? "blue" 
                          : batchData.status === "cancelled" 
                            ? "red" 
                            : "gray"
                    }
                    value={batchData.status || "unknown"}
                  />
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Mode:</Typography>
                  <div className="flex gap-1">
                    {batchData.courseMode?.map((mode, idx) => (
                      <Chip 
                        key={idx}
                        size="sm"
                        variant="outlined" 
                        value={mode.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Capacity & Enrollment
              </Typography>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Offline Capacity:</Typography>
                  <Typography variant="small">{batchData.offlineCapacity || 0} seats</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Offline Filled:</Typography>
                  <Typography variant="small">{batchData.filledOfflineSeats || 0} students</Typography>
                </div>
                {batchData.onlineCapacity > 0 && (
                  <>
                    <div className="flex justify-between">
                      <Typography variant="small" color="gray">Online Capacity:</Typography>
                      <Typography variant="small">{batchData.onlineCapacity || 0} seats</Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="small" color="gray">Online Filled:</Typography>
                      <Typography variant="small">{batchData.filledOnlineSeats || 0} students</Typography>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Assigned Staff
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batchData.trainers && batchData.trainers.length > 0 ? (
                  <div className="flex items-center gap-4">
                    <div>
                      <Typography variant="small" className="font-medium">
                        {batchData.trainers[0].username || "Unknown Name"}
                      </Typography>
                      <Typography variant="small" color="gray">
                        Trainer
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography variant="small" color="gray">No trainer assigned</Typography>
                )}
                
                {batchData.academicCouncillor ? (
                  <div className="flex items-center gap-4">
                    <div>
                      <Typography variant="small" className="font-medium">
                        {batchData.academicCouncillor.username || "Unknown Name"}
                      </Typography>
                      <Typography variant="small" color="gray">
                        Academic Councillor
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography variant="small" color="gray">No academic councillor assigned</Typography>
                )}
              </div>
            </Card>
          </div>
          
          {/* Fee details */}
          <div className="col-span-1 md:col-span-2">
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Fee Structure
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-3 text-center">
                  <Typography variant="h6">₹{batchData.courseFees || 0}</Typography>
                  <Typography variant="small" color="gray">Course Fee</Typography>
                </div>
                <div className="border rounded-md p-3 text-center">
                  <Typography variant="h6">₹{batchData.emiFees || 0}</Typography>
                  <Typography variant="small" color="gray">EMI Option</Typography>
                </div>
                <div className="border rounded-md p-3 text-center">
                  <Typography variant="h6">₹{batchData.admissionFees || 0}</Typography>
                  <Typography variant="small" color="gray">Admission Fee</Typography>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between">
        <div className="flex gap-3">
          <Button variant="gradient" color='green' onClick={handleAttendanceClick}>
            <UserGroupIcon className='h-6 w-6 mr-2' />
            Attendance
          </Button>
          <Button variant="gradient" color='purple' onClick={handleQrClick}>
            <QrCodeIcon className='h-6 w-6' />
          </Button>
        </div>
        <Button variant="text" onClick={handleClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

const QrFullscreen = ({ isOpen, handleClose, batchData }) => {
  if (!isOpen || !batchData) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <QrDisplayPage 
        name={batchData.name} 
        id={batchData.id} 
        onClose={handleClose} 
      />
    </div>
  );
};

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrBatchData, setQrBatchData] = useState(null);
  const [viewAttendance, setViewAttendance] = useState(false);
  const [attendanceBatchData, setAttendanceBatchData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      setIsloading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Authorization token is missing");
        navigate("/auth/sign-in");
        set(false);
        return;
      }

      try {
        const data = await fetchBatchesApi(token);
        setBatches(data);
        setFilteredBatches(data);
      } catch (error) {
        console.error("Error fetching batch list", error);
        alert("Failed to fetch batches. Please try again later.");
      } finally {
        setIsloading(false);
      }
    };

    fetchBatches();
  }, [navigate]);


  useEffect(() => {
    const filtered = batches.filter(batch => 
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (batch.course && batch.course.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (batch.batchLocation && batch.batchLocation.label.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredBatches(filtered);
  }, [searchQuery, batches]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'completed':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleRowClick = (batch) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const handleOpenQr = (batch) => {
    setQrBatchData(batch);
    setIsQrOpen(true);
  };

  const handleCloseQr = () => {
    setIsQrOpen(false);
    if (selectedBatch) {
      setIsModalOpen(true);
    }
  };

  const handleViewAttendance = (batch) => {  
    setIsModalOpen(false);
    setTimeout(() => {
      setAttendanceBatchData(batch);
      setViewAttendance(true);
    }, 300);
  };

  const handleCloseAttendance = () => {
    setViewAttendance(false);
    if (selectedBatch) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-8">
      {isLoading ? (
        <TableSkeleton/>
      ) : viewAttendance && attendanceBatchData ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" color="blue-gray">
              Attendance for {attendanceBatchData.name}
            </Typography>
            <Button variant="outlined" color="blue-gray" onClick={handleCloseAttendance}>
              Back to Batches
            </Button>
          </div>
          <AttendanceTable 
      batchDataDetails={attendanceBatchData} 
      setParentLoading={setIsloading} 
    />
        </div>
      ) : (
        <Card>
          <CardHeader variant="gradient" color="purple" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Batch Management
            </Typography>
          </CardHeader>
          
          <CardBody className="px-4">
            <div className="mb-4 flex w-full flex-col gap-6 md:w-72">
              <Input 
                label="Search batches" 
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
           <div className='overflow-hidden max-h-[400x]'>
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {["Batch Name","Start Date", "End Date", "Location", "Status"].map((head) => (
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
                    {filteredBatches.length > 0 ? (
                      filteredBatches.map((batch, index) => {
                        const isLast = index === filteredBatches.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                        
                        return (
                          <tr 
                            key={batch.id} 
                            className="hover:bg-blue-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleRowClick(batch)}
                          >
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {batch.name || "N/A"}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {formatDate(batch.startDate)}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {formatDate(batch.endDate)}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {batch.batchLocation ? batch.batchLocation.label : "N/A"}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <div className="w-max">
                                <Chip
                                  size="sm"
                                  variant="ghost"
                                  color={getStatusColor(batch.status)}
                                  value={batch.status || "unknown"}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-4 text-center">
                          <Typography variant="small" color="blue-gray">
                            {batches.length > 0 ? "No matching batches found" : "Loading batches..."}
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
      )}

      {/* Batch Detail Modal */}
      <BatchDetailModal 
        isOpen={isModalOpen && !isQrOpen && !viewAttendance}
        handleClose={() => setIsModalOpen(false)}
        batchData={selectedBatch}
        onOpenQr={handleOpenQr}
        onViewAttendance={handleViewAttendance}
      />
      
      {/* QR Fullscreen Component */}
      <QrFullscreen 
        isOpen={isQrOpen}
        handleClose={handleCloseQr}
        batchData={qrBatchData}
      />
    </div>
  );
};

export default Batches;