import { useEffect, useState } from "react";
import axios from "axios";
import ApodComponent from "./components/PhotoDay";

const API_KEY = "dnri8JUIdkbbAU3HBcBE8HuW8TbfoVufudqeHwQU";

// Available rovers
const ROVERS = ["Curiosity", "Opportunity", "Spirit"];

// Camera types with descriptions
const CAMERAS = {
  FHAZ: "Front Hazard Avoidance Camera",
  RHAZ: "Rear Hazard Avoidance Camera",
  MAST: "Mast Camera",
  CHEMCAM: "Chemistry and Camera Complex",
  MAHLI: "Mars Hand Lens Imager",
  MARDI: "Mars Descent Imager",
  NAVCAM: "Navigation Camera",
  PANCAM: "Panoramic Camera",
  MINITES: "Miniature Thermal Emission Spectrometer"
};

// Different rovers have different camera types available
const ROVER_CAMERAS = {
  Curiosity: ["FHAZ", "RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"],
  Opportunity: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"],
  Spirit: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"]
};

interface Photo {
  id: number;
  img_src: string;
  earth_date: string;
  camera: {
    name: string;
    full_name: string;
  };
  rover: {
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedRover, setSelectedRover] = useState<string>("Curiosity");
  const [sol, setSol] = useState<number>(1000);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [earthDate, setEarthDate] = useState<string>("");
  const [availableCameras, setAvailableCameras] = useState<string[]>(ROVER_CAMERAS.Curiosity);
  
  // Modal state
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Fetch photos based on current filters
  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover.toLowerCase()}/photos?`;
    
    // Add either sol or earth_date parameter (but not both, as API doesn't support that)
    if (earthDate) {
      url += `earth_date=${earthDate}`;
    } else {
      url += `sol=${sol}`;
    }
    
    // Add camera filter if selected
    if (selectedCamera) {
      url += `&camera=${selectedCamera.toLowerCase()}`;
    }
    
    // Add API key
    url += `&api_key=${API_KEY}`;
    
    try {
      const response = await axios.get(url);
      if (response.data.photos.length === 0) {
        setError("No photos found for the selected filters. Try different options.");
        setPhotos([]);
      } else {
        setPhotos(response.data.photos);
      }
    } catch (err) {
      setError("Error fetching photos. Please try again.");
      console.error("Error while loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update available cameras when rover changes
  useEffect(() => {
    setAvailableCameras(ROVER_CAMERAS[selectedRover as keyof typeof ROVER_CAMERAS]);
    setSelectedCamera(""); // Reset camera selection when rover changes
  }, [selectedRover]);

  // Fetch photos when component mounts
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPhotos();
  };

  // Reset date when switching between sol and earth date
  const handleSolChange = (value: number) => {
    setSol(value);
    setEarthDate("");
  };

  const handleEarthDateChange = (value: string) => {
    setEarthDate(value);
    setSol(1000); // Reset to default sol
  };

  // Open modal with selected photo
  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setSelectedPhoto(null);
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  };

  // Close modal when clicking outside of image
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPhoto) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedPhoto]);

  return (
    <>
    <div>
      <ApodComponent />
    </div>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Mars Rover Photos</h1>
      
      {/* Filters Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-100 p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rover Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rover</label>
            <select
              value={selectedRover}
              onChange={(e) => setSelectedRover(e.target.value)}
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
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">All Cameras</option>
              {availableCameras.map(camera => (
                <option key={camera} value={camera}>{camera} - {CAMERAS[camera as keyof typeof CAMERAS]}</option>
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
                onClick={() => setEarthDate("")}
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
      
      {/* Rover Info */}
      {photos.length > 0 && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-2">{photos[0].rover.name} Rover</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Launch Date:</span> {photos[0].rover.launch_date}
            </div>
            <div>
              <span className="font-medium">Landing Date:</span> {photos[0].rover.landing_date}
            </div>
            <div>
              <span className="font-medium">Status:</span> 
              <span className={photos[0].rover.status === "active" ? "text-green-600" : "text-red-600"}>
                {" "}{photos[0].rover.status.charAt(0).toUpperCase() + photos[0].rover.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}
      
      {/* Photos Grid */}
      {!loading && photos.length > 0 && (
        <div>
          <p className="mb-4 text-gray-600">Found {photos.length} photos. Click on any photo to enlarge.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div 
                key={photo.id} 
                className="overflow-hidden rounded-lg shadow-lg bg-white cursor-pointer transform transition hover:scale-105"
                onClick={() => openModal(photo)}
              >
                <img 
                  src={photo.img_src} 
                  alt={`Mars - ${photo.camera.full_name}`} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm text-gray-600">{photo.camera.full_name}</p>
                  <p className="text-xs text-gray-500">Earth Date: {photo.earth_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Modal for enlarged photo */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={handleModalClick}
        >
          <div className="relative max-w-5xl w-full max-h-full flex flex-col">
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 z-10 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
            
            {/* Image container */}
            <div className="bg-white p-4 rounded-lg shadow-lg overflow-hidden">
              <img 
                src={selectedPhoto.img_src} 
                alt={`Mars - ${selectedPhoto.camera.full_name}`} 
                className="max-h-[80vh] mx-auto"
              />
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium">{selectedPhoto.camera.full_name}</h3>
                <p className="text-gray-600">Taken by {selectedPhoto.rover.name} on {selectedPhoto.earth_date}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;