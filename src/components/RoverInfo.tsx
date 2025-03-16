import React from "react";

interface RoverInfoProps {
  rover: {
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

const RoverInfo: React.FC<RoverInfoProps> = ({ rover }) => {
  return (
    <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h2 className="text-xl font-semibold mb-2">{rover.name} Rover</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium">Launch Date:</span> {rover.launch_date}
        </div>
        <div>
          <span className="font-medium">Landing Date:</span> {rover.landing_date}
        </div>
        <div>
          <span className="font-medium">Status:</span> 
          <span className={rover.status === "active" ? "text-green-600" : "text-red-600"}>
            {" "}{rover.status.charAt(0).toUpperCase() + rover.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoverInfo;