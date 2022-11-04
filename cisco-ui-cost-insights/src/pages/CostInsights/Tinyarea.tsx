import React, { useEffect, useState } from "react";
import { TinyArea } from "@ant-design/plots";

const Tinyarea = (cloudProvider: any) => {
  const [data, setData] = useState([]);
  const [cost, setCost] = useState([]);

  var values: any = [];
  var balances: any = [];

  useEffect(() => {
    asyncFetch();
  }, []);
  // const asyncFetch = () => {
  //   axios
  //     .get("../costinsightsdata/chartsdata.json")
  //     .then((res) => {
  //       // console.log(res.data[0].value);
  //       for (let i = 0; i < res.data.length; i++) {
  //         // data = res.data[i].value;
  //         values[i] = res.data[i].value;
  //         balances[i] = res.data[i].balance;
  //         // console.log(values);
  //         // data=[...values]
  //         // data.push(...values);
  //         // console.log("data", data);
  //       }
  //       setData([...values]);
  //       setCost([...balances]);
  //     })
  //     .catch((err) => console.log(err));
  // };
  const asyncFetch = () => {
    fetch("../costinsightsdata/chartsdata.json")
      .then((res: any) => res.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          if (cloudProvider.cloud === "AWS") {
            values[i] = data[i].valueaws;
          } else if (cloudProvider.cloud === "GCP") {
            values[i] = data[i].valuegcp;
          } else if (cloudProvider.cloud === "AZURE") {
            values[i] = data[i].valueazure;
          } else {
            values[i] =
              data[i].valueaws + data[i].valuegcp + data[i].valueazure;
          }
          // balances[i] = data[i].balance;
        }
        setData([...values]);
        setCost([...balances]);
      })

      .catch((err) => {
        console.log(err, " error");
      });
  };
  const config = {
    height: 60,
    autoFit: false,
    data,
    smooth: true,
    line: {
      color: `${
        cloudProvider.cloud === "AWS"
          ? "#e43830"
          : cloudProvider.cloud === "GCP"
          ? "#bababd"
          : cloudProvider.cloud === "AZURE"
          ? "#77c458"
          : "#e43830"
      }`,
      size: 2,
    },
    areaStyle: {
      fill: `${
        cloudProvider.cloud === "AWS"
          ? "#fde9e9"
          : cloudProvider.cloud === "GCP"
          ? "#ededed"
          : cloudProvider.cloud === "AZURE"
          ? "#ebf3e7"
          : "#fde9e9"
      }`,
    },
  };

  return (
    <div>
      <TinyArea {...config} />
    </div>
  );
};

export default Tinyarea;
