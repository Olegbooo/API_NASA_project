import React from "react";
import { Photo } from "../types";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick }) => {
  return (
    <div 
      className="overflow-hidden rounded-lg shadow-lg bg-white cursor-pointer transform transition hover:scale-105"
      onClick={onClick}
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
  );
};

export default PhotoCard;