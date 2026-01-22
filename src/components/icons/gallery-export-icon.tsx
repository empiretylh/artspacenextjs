import * as React from "react";

const GalleryExportIcon = ({
   size = 24,
   color = "currentColor",
   strokeWidth = 0.2,
   ...props
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props} // Allows passing className, style, onClick, etc.
   >
      {/* SVG paths copied directly */}
      <path
         d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
         stroke={color}
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M13 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10"
         stroke={color}
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M18 8V2L20 4"
         stroke={color}
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M18 2L16 4"
         stroke={color}
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M2.67001 18.95L7.60001 15.64C8.39001 15.11 9.53001 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9"
         stroke={color}
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

export default GalleryExportIcon;
