import { useState, useEffect } from "react";
import axios from "axios";
import FilterForm from "./FilterForm";
import RoverInfo from "./RoverInfo";
import PhotoGrid from "./PhotoGrid";
import PhotoModal from "./PhotoModal";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import { Photo, FilterState } from "../types";
import { API_KEY, ROVER_CAMERAS } from "../utils/constants.ts";

function MarsRoverExplorer() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filterState, setFilterState] = useState<FilterState>({
    selectedRover: "Curiosity",
    sol: 1000,
    selectedCamera: "",
    earthDate: ""
  });
  
  const [availableCameras, setAvailableCameras] = useState<string[]>(
    ROVER_CAMERAS.Curiosity
  );
  
  // Modal state
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Fetch photos based on current filters
  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    
    const { selectedRover, sol, selectedCamera, earthDate } = filterState;
    
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
    setAvailableCameras(ROVER_CAMERAS[filterState.selectedRover as keyof typeof ROVER_CAMERAS]);
    setFilterState(prev => ({ ...prev, selectedCamera: "" })); // Reset camera selection when rover changes
  }, [filterState.selectedRover]);

  // Fetch photos when component mounts
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilterState: FilterState) => {
    setFilterState(newFilterState);
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

  return (
    <>
      <FilterForm 
        filterState={filterState}
        availableCameras={availableCameras}
        onFilterChange={handleFilterChange}
        onSubmit={fetchPhotos}
      />
      
      {/* Rover Info */}
      {photos.length > 0 && <RoverInfo rover={photos[0].rover} />}
      
      {/* Error Message */}
      {error && <ErrorMessage message={error} />}
      
      {/* Loading State */}
      {loading && <Loading />}
      
      {/* Photos Grid */}
      {!loading && photos.length > 0 && (
        <PhotoGrid photos={photos} onPhotoClick={openModal} />
      )}
      
      {/* Modal for enlarged photo */}
      {selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={closeModal} />
      )}
    </>
  );
}

export default MarsRoverExplorer;