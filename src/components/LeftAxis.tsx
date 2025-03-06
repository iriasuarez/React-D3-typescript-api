import { ScaleBand } from "d3";

interface LeftAxisProps {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  yScale: ScaleBand<string>;
}

export function LeftAxis({ margins, yScale }: LeftAxisProps) {
  return (
    <g transform={`translate(0, ${margins.top})`}>
      {yScale.domain().map((band: number) => (
        <text
          key={band}
          transform={`translate(0, ${yScale(band) + yScale.bandwidth() / 2})`}
          dominantBaseline="middle"
          fontWeight="bold"
        >
          {band}
        </text>
      ))}
    </g>
  );
}
