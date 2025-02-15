import React from "react";

type LineCap = "butt" | "round" | "square";

interface MultiSegmentAutoProps {
  size?: number;
  strokeWidth?: number;
  totalValue?: number;
  maxValue?: number;
  segmentsCount?: number;
  segmentColors?: string[];
  gap?: number;
  label?: React.ReactNode;
  outerPadding?: number;
  innerPadding?: number;
  strokeLinecap?: LineCap;
  showBackgroundCircle?: boolean;
  backgroundCircleColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<SVGElement>;
  onMouseEnter?: React.MouseEventHandler<SVGElement>;
  onMouseLeave?: React.MouseEventHandler<SVGElement>;
}

const MultiSegmentAuto: React.FC<MultiSegmentAutoProps> = ({
  size = 120,
  strokeWidth = 10,
  totalValue = 80,
  maxValue = 100,
  segmentsCount = 4,
  segmentColors = ["#24CCA7", "#FFCE31", "#FF5C5C", "#9999FF"],
  gap = 2,
  label = "",
  outerPadding = 0,
  innerPadding = 0,
  strokeLinecap = "round",
  showBackgroundCircle = false,
  backgroundCircleColor = "#ddd",
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const clampedValue = Math.min(totalValue, maxValue);
  let radius = size / 2 - outerPadding - strokeWidth / 2 - innerPadding;
  if (radius < 0) radius = 0;
  const circumference = 2 * Math.PI * radius;
  let remainingArc = (clampedValue / maxValue) * circumference;
  const segmentArc = circumference / segmentsCount;
  const effectiveColors = Array.from(Array(segmentsCount), (_, i) => {
    return segmentColors[i % segmentColors.length];
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible", ...style }}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {showBackgroundCircle && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundCircleColor}
            strokeWidth={strokeWidth}
          />
        )}
        {Array.from(Array(segmentsCount)).map((_, i) => {
          if (remainingArc <= 0) return null;
          const color = effectiveColors[i];
          const fillArc = Math.min(segmentArc, remainingArc);
          const dashArray = `${fillArc} ${circumference - fillArc}`;
          const strokeDashoffset = -(i * (segmentArc + gap));
          remainingArc -= fillArc;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap={strokeLinecap}
            />
          );
        })}
      </g>
      {label && (
        <foreignObject x={0} y={0} width={size} height={size}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {label}
          </div>
        </foreignObject>
      )}
    </svg>
  );
};

export default MultiSegmentAuto;
