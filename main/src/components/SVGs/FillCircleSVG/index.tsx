interface FillCircleSVGProps {
  size?: number;
  color?: string;
}

const FillCircleSVG = ({ size, color }: FillCircleSVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  );
};

FillCircleSVG.defaultProps = {
  size: 15,
  color: "black",
};

export default FillCircleSVG;
