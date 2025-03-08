import React from "react";
import { 
  IconButton, 
  SpeedDial, 
  SpeedDialHandler, 
  SpeedDialContent, 
  SpeedDialAction,
  Typography,
} from "@material-tailwind/react";
import { PlusIcon,UserPlusIcon,ArrowPathIcon  } from "@heroicons/react/24/outline";
import { processApi } from "@/services/userApi";


const token = localStorage.getItem("token");
console.log(token)

const handleReload = async (batchId,token) => {
  try {
    const response = await processApi(batchId,token);
    console.log(response)
  } catch (error) {
    throw error;
  }
}


const ControlledSpeedDial = ({batchId}) => {
  return (
    <div className="fixed z-50 bottom-4 right-4">
      <SpeedDial>
        <SpeedDialHandler>
          <IconButton size="lg" className="rounded-full bg-purple-600">
            <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent>
          <SpeedDialAction className="bg-purple-200 h-16 w-16" onClick={() => handleReload(batchId,token)}>
            <ArrowPathIcon  className="h-5 w-5" /> 
            <Typography color="blue-gray" className="text-xs font-normal">
            Reload
              </Typography>
          </SpeedDialAction>
          <SpeedDialAction className="bg-purple-200 h-16 w-16">
            <UserPlusIcon className="h-5 w-5" /> 
            <Typography color="blue-gray" className="text-xs font-normal">
            Add
              </Typography>
          </SpeedDialAction>
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
};

export default ControlledSpeedDial;
