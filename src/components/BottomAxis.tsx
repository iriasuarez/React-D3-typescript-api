import { ScaleLinear } from "d3";

interface BottomAxisProps {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  xScale: ScaleLinear<number, number>;
  boundedHeight: number;
}

export function BottomAxis({
  margins,
  xScale,
  boundedHeight,
}: BottomAxisProps) {
  return (
    <g transform={`translate(${margins.left}, ${boundedHeight + margins.top})`}>
      {xScale.ticks().map((tick: number) => (
        <g key={tick}>
          <rect
            height="15"
            width="3"
            transform={`translate(${xScale(tick)})`}
          />
          <text
            fontSize=".75rem"
            dominantBaseline="hanging"
            textAnchor="middle"
            transform={`translate(${xScale(tick) + 1.5}, 17)`}
          >
            {tick}
          </text>
        </g>
      ))}
    </g>
  );
}
