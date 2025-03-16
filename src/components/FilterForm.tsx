import React from "react";
import { FilterState } from "../types";
import { ROVERS, CAMERAS } from "../utils/constants.ts";

interface FilterFormProps {
  filterState: FilterState;
  availableCameras: string[];
  onFilterChange: (newState: FilterState) => void;
  onSubmit: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ 
  filterState, 
  availableCameras, 
  onFilterChange, 
  onSubmit 
}) => {
  const { selectedRover, sol, selectedCamera, earthDate } = filterState;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Reset date when switching between sol and earth date
  const handleSolChange = (value: number) => {
    onFilterChange({
      ...filterState,
      sol: value,
      earthDate: ""
    });
  };

  const handleEarthDateChange = (value: string) => {
    onFilterChange({
      ...filterState,
      earthDate: value,
      sol: 1000 // Reset to default sol
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-gray-100 p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rover Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rover</label>
          <select
            value={selectedRover}
            onChange={(e) => onFilterChange({ ...filterState, selectedRover: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          >
            {ROVERS.map(rover => (
              <option key={rover} value={rover}>{rover}</option>
            ))}
          </select>
        </div>
        
        {/* Camera Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Camera (Optional)</label>
          <select
            value={selectedCamera}
            onChange={(e) => onFilterChange({ ...filterState, selectedCamera: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          >
            <option value="">All Cameras</option>
            {availableCameras.map(camera => (
              <option key={camera} value={camera}>
                {camera} - {CAMERAS[camera as keyof typeof CAMERAS]}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sol Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Martian Sol {earthDate ? "(disabled)" : ""}
          </label>
          <input
            type="number"
            min="0"
            value={sol}
            onChange={(e) => handleSolChange(parseInt(e.target.value))}
            disabled={!!earthDate}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 disabled:bg-gray-200"
          />
        </div>
        
        {/* Earth Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Earth Date {!earthDate ? "(disabled)" : ""}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={earthDate}
              onChange={(e) => handleEarthDateChange(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            <button 
              type="button"
              onClick={() => onFilterChange({ ...filterState, earthDate: "" })}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Use either Sol or Earth Date
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors"
        >
          Search Photos
        </button>
      </div>
    </form>
  );
};

export default FilterForm;