import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography
} from '@material-tailwind/react';

const DateFilterDialog = ({ 
  isOpen, 
  onClose, 
  onApply, 
  onReset,
  startDate: parentStartDate,
  endDate: parentEndDate,
  availableDates
}) => {
  // Local state for date values
  const [localStartDate, setLocalStartDate] = useState('');
  const [localEndDate, setLocalEndDate] = useState('');

  // Update local state when parent props change
  useEffect(() => {
    if (isOpen) {
      setLocalStartDate(parentStartDate || '');
      setLocalEndDate(parentEndDate || '');
    }
  }, [isOpen, parentStartDate, parentEndDate]);

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleApply = () => {
    onApply(localStartDate, localEndDate);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };


  const setLastSevenDays = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    setLocalStartDate(start.toISOString().split('T')[0]);
    setLocalEndDate(end.toISOString().split('T')[0]);
  };

  const setLastThirtyDays = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setLocalStartDate(start.toISOString().split('T')[0]);
    setLocalEndDate(end.toISOString().split('T')[0]);
  };

  const setCurrentMonth = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    setLocalStartDate(start.toISOString().split('T')[0]);
    setLocalEndDate(today.toISOString().split('T')[0]);
  };

  const setPreviousMonth = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 0);
    setLocalStartDate(start.toISOString().split('T')[0]);
    setLocalEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <Dialog size="xs" open={isOpen} handler={onClose}>
      <DialogHeader className="border-b pb-3">
        <Typography variant="h5" color="blue-gray">
          Filter Attendance by Date Range
        </Typography>
      </DialogHeader>
      <DialogBody className="pt-4">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Start Date
              </Typography>
              <Input
                type="date"
                value={formatDateForInput(localStartDate)}
                onChange={(e) => setLocalStartDate(e.target.value)}
                className="!border !border-gray-300 focus:!border-gray-500"
                containerProps={{
                  className: "min-w-full"
                }}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                End Date
              </Typography>
              <Input
                type="date"
                value={formatDateForInput(localEndDate)}
                onChange={(e) => setLocalEndDate(e.target.value)}
                className="!border !border-gray-300 focus:!border-gray-500"
                containerProps={{
                  className: "min-w-full"
                }}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          {/* Quick selection options */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-3 font-medium">
              Quick Select
            </Typography>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button 
                size="sm" 
                variant="outlined" 
                onClick={setLastSevenDays}
                className="normal-case"
              >
                Last 7 Days
              </Button>
              <Button 
                size="sm" 
                variant="outlined" 
                onClick={setLastThirtyDays}
                className="normal-case"
              >
                Last 30 Days
              </Button>
              <Button 
                size="sm" 
                variant="outlined" 
                onClick={setCurrentMonth}
                className="normal-case"
              >
                This Month
              </Button>
              <Button 
                size="sm" 
                variant="outlined" 
                onClick={setPreviousMonth}
                className="normal-case"
              >
                Last Month
              </Button>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2 pt-2 border-t">
        <Button variant="outlined" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="red" onClick={handleReset}>
          Reset
        </Button>
        <Button color="blue" onClick={handleApply}>
          Apply Filter
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DateFilterDialog;