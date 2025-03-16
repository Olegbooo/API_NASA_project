// API key
export const API_KEY = "dnri8JUIdkbbAU3HBcBE8HuW8TbfoVufudqeHwQU";

// Available rovers
export const ROVERS = ["Curiosity", "Opportunity", "Spirit"];

// Camera types with descriptions
export const CAMERAS = {
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
export const ROVER_CAMERAS = {
  Curiosity: ["FHAZ", "RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"],
  Opportunity: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"],
  Spirit: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"]
};