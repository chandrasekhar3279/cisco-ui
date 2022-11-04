interface ShieldSVGProps {
  size?: number;
  color?: string;
  borderColor?: string;
}

const ShieldSVG = ({ size, color, borderColor }: ShieldSVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={borderColor}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-shield"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
};

ShieldSVG.defaultProps = {
  size: 15,
  color: "black",
  borderColor: "black",
};

export default ShieldSVG;
