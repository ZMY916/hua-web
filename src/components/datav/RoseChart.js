import { useEffect, useState } from "react";

import { Charts } from "@jiaminghi/data-view-react";

import "./RoseChart.less";

function getData() {
  return {
    series: [
      {
        type: "pie",
        radius: "50%",
        roseSort: false,
        data: [
          { name: "矿区A", value: randomExtend(40, 70) },
          { name: "矿区B", value: randomExtend(20, 30) },
          { name: "矿区C", value: randomExtend(10, 50) },
          { name: "矿区D", value: randomExtend(5, 20) },
          { name: "矿区E", value: randomExtend(40, 50) },
          { name: "矿区F", value: randomExtend(20, 30) },
          { name: "矿区G", value: randomExtend(5, 10) },
          { name: "矿区H", value: randomExtend(20, 35) },
          { name: "矿区I", value: randomExtend(5, 10) },
        ],
        insideLabel: {
          show: false,
        },
        outsideLabel: {
          formatter: "{name} {percent}%",
          labelLineEndLength: 20,
          style: {
            fill: "#fff",
          },
          labelLineStyle: {
            stroke: "#fff",
          },
        },
        roseType: true,
      },
    ],
    color: [
      "#da2f00",
      "#fa3600",
      "#ff4411",
      "#ff724c",
      "#541200",
      "#801b00",
      "#a02200",
      "#5d1400",
      "#b72700",
    ],
  };
}

function randomExtend(minNum, maxNum) {
  if (arguments.length === 1) {
    return parseInt(Math.random() * minNum + 1, 10);
  } else {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
  }
}

export default () => {
  const [option, setData] = useState({});

  useEffect(() => {
    createData();

    setInterval(createData, 30000);
  }, []);

  function createData() {
    setData(getData());
  }

  return (
    <div id="rose-chart">
      <div className="rose-chart-title">累计计量区域分布</div>
      <Charts option={option} />
    </div>
  );
};
