import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Textarea,
  Typography
} from '@material-tailwind/react';

const AttendanceRemarkDialog = ({ isOpen, onClose, onSave, remarkData, formatDate }) => {

  const [localRemark, setLocalRemark] = useState('');
  const [localStatus, setLocalStatus] = useState('');


  useEffect(() => {
    if (isOpen && remarkData) {
      setLocalRemark(remarkData.remark || '');
      setLocalStatus(remarkData.status || '');
    }
  }, [isOpen, remarkData]);

  const handleSave = () => {
    // Only send updated data back to parent when save is clicked
    onSave({
      ...remarkData,
      remark: localRemark,
      status: localStatus
    });
  };

  // Early return if no data
  if (!remarkData || !remarkData.student) {
    return null;
  }

  return (
    <Dialog size="xs" open={isOpen} handler={onClose}>
      <DialogHeader>
        {localStatus === "absent" ? "Add Absence Remark" : "Mark Attendance"}
      </DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Student: {remarkData.student?.student_name}
            </Typography>
            <Typography variant="small" color="blue-gray" className="mb-4 font-medium">
              Date: {remarkData.date && formatDate(remarkData.date)}
            </Typography>
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Status:
              </Typography>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color={localStatus === "present" ? "green" : "gray"}
                  variant={localStatus === "present" ? "filled" : "outlined"}
                  onClick={() => {
                    setLocalStatus("present");
                    setLocalRemark(''); // Clear remark when present
                  }}
                >
                  Present
                </Button>
                <Button
                  size="sm"
                  color={localStatus === "absent" ? "red" : "gray"}
                  variant={localStatus === "absent" ? "filled" : "outlined"}
                  onClick={() => setLocalStatus("absent")}
                >
                  Absent
                </Button>
              </div>
            </div>
          </div>
          {localStatus === "absent" && (
            <Textarea
              label="Remark"
              value={localRemark}
              onChange={(e) => setLocalRemark(e.target.value)}
              rows={4}
              required
            />
          )}
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="outlined" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={handleSave}
          disabled={localStatus === "absent" && !localRemark.trim()}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AttendanceRemarkDialog;