import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";

const colors: any = {
  AWS: "#fd9a00",
  AZURE: "#028ad8",
  GCP: "#d7463a",
};

const Barlines = ({ selectedCloud = "all" }: { selectedCloud: string }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch("../costinsightsdata/threebarsdata.json")
      .then((response) => response.json())
      .then((json) => setData(json))

      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  const config: any = {
    data:
      selectedCloud == "All"
        ? data
        : data.filter((x) => x.type == selectedCloud.toUpperCase()),
    xField: "Date",
    yField: "value",
    seriesField: "type",
    isGroup: "true",
    columnStyle: {
      radius: [0, 0, 0, 0],
      width: [5, 5, 5],
    },
    legend: {
      layout: "horizontal",
      position: "top",
    },
    color:
      selectedCloud == "All"
        ? [colors.AWS, colors.AZURE, colors.GCP]
        : [colors?.[selectedCloud.toUpperCase()]],
  };

  return <Column {...config} />;
};

export default Barlines;
