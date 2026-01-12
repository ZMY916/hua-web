import { Charts } from "@jiaminghi/data-view-react";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";

const MiningMap = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // 初始化图表
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      // 自定义小人图标（SVG路径）
      const personIcon =
        "path://M18 3C19.6569 3 21 4.34315 21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3ZM9 11C10.6569 11 12 12.3431 12 14C12 15.6569 10.6569 17 9 17C7.34315 17 6 15.6569 6 14C6 12.3431 7.34315 11 9 11ZM9 3C10.6569 3 12 4.34315 12 6C12 7.65685 10.6569 9 9 9C7.34315 9 6 7.65685 6 6C6 4.34315 7.34315 3 9 3ZM18 11C19.6569 11 21 12.3431 21 14C21 15.6569 19.6569 17 18 17C16.3431 17 15 15.6569 15 14C15 12.3431 16.3431 11 18 11ZM3 19C3 15.134 6.13401 12 10 12C12.3447 12 14.4292 13.1451 15.7324 15H16.2676C17.5708 13.1451 19.6553 12 22 12C25.866 12 29 15.134 29 19V25H3V19Z";

      // 静态矿道路径数据
      const mineCoordinates = [
        [-40, -30, "入口"],
        [-20, -25, "巷道1"],
        [0, -20, "交叉口"],
        [20, -10, "工作面A"],
        [30, 0, "工作面B"],
        [20, 10, "工作面C"],
        [0, 20, "通风口"],
        [-20, 25, "出口"],
      ];

      // 静态设备数据
      const deviceData = [
        { name: "设备1", x: -35, y: -28, status: "online" },
        { name: "设备2", x: -18, y: -23, status: "online" },
        { name: "设备3", x: 2, y: -18, status: "warning" },
        { name: "设备4", x: 22, y: -8, status: "online" },
        { name: "设备5", x: 28, y: 2, status: "offline" },
        { name: "设备6", x: 18, y: 12, status: "online" },
        { name: "设备7", x: -2, y: 22, status: "online" },
      ];

      const option = {
        title: {
          text: "矿道示意图",
          left: "center",
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            if (params.seriesType === "custom") {
              return `${params.data.name}<br/>坐标: [${params.data.coord[0]}, ${params.data.coord[1]}]<br/>状态: ${params.data.status}`;
            }
            return params.name;
          },
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "10%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          min: -50,
          max: 50,
          splitLine: { show: false }, // 关闭x轴网格线
          axisLine: { lineStyle: { color: "#fff" } },
          axisLabel: { color: "#fff" },
        },
        yAxis: {
          show: false, // 隐藏整个 X 轴
          type: "value",
          min: -50,
          max: 50,
          splitLine: { show: false }, // 关闭y轴网格线
          axisLine: { lineStyle: { color: "#fff" } },
          axisLabel: { color: "#fff" },
        },
        series: [
          // 矿道路径线
          {
            name: "矿道路径",
            type: "line",
            data: mineCoordinates.map((coord) => [coord[0], coord[1]]),
            symbol: "none",
            lineStyle: {
              color: "#55aaff",
              width: 3,
            },
            itemStyle: {
              color: "#ff7f4f",
            },
          },
          // 设备位置点（小人图标）
          {
            name: "设备位置",
            type: "custom",
            renderItem: function (params, api) {
              const point = api.coord([api.value(0), api.value(1)]);
              const status = api.value(2); // 状态值，用于确定颜色

              // 根据状态设置颜色
              let color = "#00ff00"; // 默认绿色（在线）
              if (status === "offline") color = "#ff0000"; // 离线红色
              else if (status === "warning") color = "#ffff00"; // 警告黄色

              return {
                type: "path",
                path: personIcon,
                shape: {
                  x: point[0] - 10,
                  y: point[1] - 15,
                  width: 20,
                  height: 30,
                },
                style: api.style({
                  fill: color,
                  stroke: "#fff",
                  lineWidth: 1,
                }),
                z2: 100,
              };
            },
            encode: {
              x: 0,
              y: 1,
              tooltip: 3, // 显示名称
            },
            data: deviceData.map((device) => [
              device.x,
              device.y,
              device.status,
              device.name,
            ]),
          },
        ],
      };

      chartInstance.current.setOption(option);
    }

    // 组件卸载时销毁图表
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  return <Charts></Charts>;
};

export default MiningMap;
