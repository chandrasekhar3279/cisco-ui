import React, { useState, useEffect } from "react";
import { Area } from "@ant-design/plots";

const Forecast = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch("../costinsightsdata/forecast.json")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  const config: any = {
    data,
    xField: "Date",
    yField: "scales",
    annotations: [
      {
        type: "text",
        position: ["min", "median"],
        content: "A",
        offsetY: -4,
        style: {
          textBaseline: "bottom",
        },
      },
      {
        type: "line",
        start: ["min", "median"],
        end: ["max", "median"],
        style: {
          stroke: "red",
          lineDash: [2, 2],
        },
      },
    ],
  };

  return (
    <div>
      <Area {...config} />
    </div>
  );
};

export default Forecast;
