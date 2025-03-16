import React, { useEffect } from "react";
import { Photo } from "../types";

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  // Handle modal click (close when clicking outside the image)
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={handleModalClick}
    >
      <div className="relative max-w-5xl w-full max-h-full flex flex-col">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors"
        >
          ×
        </button>
        
        {/* Image container */}
        <div className="bg-white p-4 rounded-lg shadow-lg overflow-hidden">
          <img 
            src={photo.img_src} 
            alt={`Mars - ${photo.camera.full_name}`} 
            className="max-h-[80vh] mx-auto"
          />
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium">{photo.camera.full_name}</h3>
            <p className="text-gray-600">Taken by {photo.rover.name} on {photo.earth_date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;