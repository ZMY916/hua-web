import { useEffect, useState } from "react";

import { Decoration10, DigitalFlop } from "@jiaminghi/data-view-react";

import "./DigitalFlop.less";

function getData() {
  return [
    {
      title: "设备名称",
      number: {
        // number: [randomExtend(20000, 30000)],
        content: "可见光系统",
        textAlign: "right",
        style: {
          fill: "#4d99fc",
          fontWeight: "bold",
          fontSize: 15,
        },
      },
      // unit: "公里",
    },
    {
      title: "所属产品",
      number: {
        // number: [randomExtend(20, 30)],
        content: "VLP系统1",
        textAlign: "right",
        style: {
          fill: "#f46827",
          fontWeight: "bold",
          fontSize: 15,
        },
      },
      // unit: "座",
    },
    {
      title: "服务个数",
      number: {
        number: [3],
        content: "{nt}",
        textAlign: "right",
        style: {
          fill: "#40faee",
          fontWeight: "bold",
        },
      },
      unit: "个",
    },
    {
      title: "绑定人数",
      number: {
        number: [3],
        content: "{nt}",
        textAlign: "right",
        style: {
          fill: "#4d99fc",
          fontWeight: "bold",
        },
      },
      unit: "个",
    },
    {
      title: "设备标识码",
      number: {
        // number: [randomExtend(5, 10)],
        content: "VLP1",
        textAlign: "right",
        style: {
          fill: "#f46827",
          fontWeight: "bold",
          fontSize: 15,
        },
      },
      // unit: "个",
    },
    // {
    //   title: "服务区",
    //   number: {
    //     number: [randomExtend(5, 10)],
    //     content: "{nt}",
    //     textAlign: "right",
    //     style: {
    //       fill: "#40faee",
    //       fontWeight: "bold",
    //     },
    //   },
    //   unit: "个",
    // },
    // {
    //   title: "收费站",
    //   number: {
    //     number: [randomExtend(5, 10)],
    //     content: "{nt}",
    //     textAlign: "right",
    //     style: {
    //       fill: "#4d99fc",
    //       fontWeight: "bold",
    //     },
    //   },
    //   unit: "个",
    // },
    // {
    //   title: "超限站",
    //   number: {
    //     number: [randomExtend(5, 10)],
    //     content: "{nt}",
    //     textAlign: "right",
    //     style: {
    //       fill: "#f46827",
    //       fontWeight: "bold",
    //     },
    //   },
    //   unit: "个",
    // },
    // {
    //   title: "停车区",
    //   number: {
    //     number: [randomExtend(5, 10)],
    //     content: "{nt}",
    //     textAlign: "right",
    //     style: {
    //       fill: "#40faee",
    //       fontWeight: "bold",
    //     },
    //   },
    //   unit: "个",
    // },
  ];
}

function randomExtend(minNum, maxNum) {
  if (arguments.length === 1) {
    return parseInt(Math.random() * minNum + 1, 10);
  } else {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
  }
}

export default () => {
  const [digitalFlopData, setData] = useState([]);

  useEffect(() => {
    createData();

    const timer = setInterval(createData, 30000);

    return () => clearInterval(timer);
  }, []);

  function createData() {
    setData(getData());
  }

  return (
    <div id="digital-flop">
      {digitalFlopData.map((item) => (
        <div className="digital-flop-item" key={item.title}>
          <div className="digital-flop-title">{item.title}</div>
          <div className="digital-flop">
            <DigitalFlop
              config={item.number}
              style={{ width: "100px", height: "50px" }}
            />
            <div className="unit">{item.unit}</div>
          </div>
        </div>
      ))}

      <Decoration10 />
    </div>
  );
};
