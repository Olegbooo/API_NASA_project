import React from "react";
import { Photo } from "../types";
import PhotoCard from "./PhotoCard";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  return (
    <div>
      <p className="mb-4 text-gray-600">Found {photos.length} photos. Click on any photo to enlarge.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <PhotoCard key={photo.id} photo={photo} onClick={() => onPhotoClick(photo)} />
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;