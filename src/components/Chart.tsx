import {
  select,
  scaleLinear,
  max,
  scaleBand,
  scaleOrdinal,
  easeCubicInOut,
} from "d3";
import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomAxis } from "./BottomAxis";
import { LeftAxis } from "./LeftAxis";
import { DataItem } from "../App";

interface ChartProps {
  data: DataItem[];
  dimensions: {
    width: number;
    height: number;
    margins: { top: number; right: number; bottom: number; left: number };
  };
  xAccessor: (d: DataItem) => number;
  yAccessor: (d: DataItem) => string;
}

export const Chart = React.memo<ChartProps>(
  ({ data, dimensions, xAccessor, yAccessor }: ChartProps) => {
    const { width, height, margins } = dimensions;
    const boundedWidth = width - margins.right - margins.left;
    const boundedHeight = height - margins.top - margins.bottom;

    const [tooltip, setTooltip] = useState<{
      name: string;
      value: number;
    } | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{
      x: number;
      y: number;
    }>({
      x: 0,
      y: 0,
    });

    const [focusedBarIndex, setFocusedBarIndex] = useState<number | null>(null);

    const xScale = scaleLinear()
      .domain([0, max(data, (d: DataItem) => xAccessor(d)) ?? 0])
      .nice()
      .range([0, boundedWidth]);

    const yScale = scaleBand()
      .domain(data.map((d) => yAccessor(d)))
      .range([boundedHeight, 0])
      .padding(0.1);

    const bandwidth = yScale.bandwidth();
    const scaledX = (d: DataItem) => xScale(xAccessor(d));
    const scaledY = (d: DataItem) => yScale(yAccessor(d));

    const colorPalette = [
      "#005f73",
      "#0a9396",
      "#ee9b00",
      "#ae2012",
      "#fcbf49",
      "#d4e157",
    ];

    const colorScale = scaleOrdinal()
      .domain(data.map((d) => yAccessor(d)))
      .range(colorPalette);

    const barsRef = useRef<SVGGElement | null>(null);

    useEffect(() => {
      if (barsRef.current) {
        const bars = select(barsRef.current).selectAll("rect").data(data);

        bars
          .transition()
          .duration(800)
          .ease(easeCubicInOut)
          .attr("width", (d: DataItem) => scaledX(d))
          .attr("fill", (d: DataItem) => colorScale(yAccessor(d)));
      }
    }, [data, yAccessor, colorScale]);

    const handleMouseOver = useCallback(
      (
        event: React.MouseEvent<SVGRectElement, MouseEvent>,
        datum: DataItem
      ) => {
        const { clientX, clientY } = event;
        setTooltip({
          name: datum.name,
          value: xAccessor(datum),
        });
        setTooltipPosition({
          x: clientX,
          y: clientY,
        });
      },
      [xAccessor]
    );

    const handleMouseOut = useCallback(() => {
      setTooltip(null);
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent<SVGRectElement>) => {
      if (
        event.key === "ArrowRight" &&
        focusedBarIndex !== null &&
        focusedBarIndex < data.length - 1
      ) {
        setFocusedBarIndex(focusedBarIndex + 1);
      } else if (
        event.key === "ArrowLeft" &&
        focusedBarIndex !== null &&
        focusedBarIndex > 0
      ) {
        setFocusedBarIndex(focusedBarIndex - 1);
      }
    };

    return (
      <div>
        <h1 role="heading" aria-level={1}>
          Bar Chart with React & D3
        </h1>
        <h2 role="heading" aria-level={2}>
          Pokemon vs Attack
        </h2>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            <g ref={barsRef}>
              {data.map((datum, index) => (
                <g
                  key={datum.name}
                  transform={`translate(0, ${scaledY(datum)})`}
                >
                  <rect
                    height={bandwidth}
                    width={0}
                    fill={colorScale(yAccessor(datum))}
                    onMouseOver={(e) => handleMouseOver(e, datum)}
                    onMouseOut={handleMouseOut}
                    tabIndex={0} // Allow focus
                    aria-labelledby={`bar-${datum.name}`}
                    aria-describedby={`bar-${datum.name}-desc`}
                    onFocus={() => setFocusedBarIndex(index)}
                    onKeyDown={handleKeyDown}
                    style={{
                      outline:
                        focusedBarIndex === index ? "3px solid blue" : "none",
                    }}
                  />
                  <text
                    fontWeight="bolder"
                    dominantBaseline="hanging"
                    transform={`translate(${scaledX(datum) + 4})`}
                    aria-hidden="true"
                  >
                    {xAccessor(datum)}
                  </text>
                  <text
                    id={`bar-${datum.name}`}
                    style={{ visibility: "hidden" }}
                    aria-live="polite"
                  >
                    {datum.name}
                  </text>
                  <text
                    id={`bar-${datum.name}-desc`}
                    style={{ visibility: "hidden" }}
                    aria-live="polite"
                  >
                    Value: {xAccessor(datum)}
                  </text>
                </g>
              ))}
            </g>
          </g>
          <BottomAxis
            margins={margins}
            boundedHeight={boundedHeight}
            xScale={xScale}
          />
          <LeftAxis margins={margins} yScale={yScale} />
        </svg>

        {tooltip && (
          <div
            style={{
              position: "absolute",
              top: tooltipPosition.y + 10,
              left: tooltipPosition.x + 10,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "5px",
              pointerEvents: "none",
            }}
          >
            <strong>{tooltip.name}</strong>: Attack {tooltip.value}
          </div>
        )}
      </div>
    );
  }
);
