interface LeftAxisProps {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  yScale: any;
}

export function LeftAxis({ margins, yScale }: LeftAxisProps) {
  return (
    <g transform={`translate(0, ${margins.top})`}>
      {yScale.domain().map((band: string) => (
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
