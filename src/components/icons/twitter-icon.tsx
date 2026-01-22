const TwitterIcon = ({
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
   >
      <path
         d="M13.676 10.6588L20.229 3.19934H18.6767L12.9843 9.67497L8.44115 3.19934H3.19987L10.0715 12.9926L3.19987 20.814H4.75219L10.7597 13.9741L15.5586 20.814H20.7999M5.31246 4.34569H7.69726L18.6756 19.724H16.2902"
         fill={color}
         fillOpacity="0.62"
      />
   </svg>
);

export default TwitterIcon;
