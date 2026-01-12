import { FullScreenContainer } from "@jiaminghi/data-view-react";

import { getDeviceOptions } from "@/services/ant-design-pro/api";
import * as echarts from "echarts"; // 引入 ECharts 核心库
import ReactECharts from "echarts-for-react"; // ECharts React 组件
import { useEffect, useRef, useState } from "react";
import DigitalFlop from "./DigitalFlop";
import ScrollBoard from "./ScrollBoard";

import TopHeader from "./TopHeader";
import WaterLevelChart from "./WaterLevelChart";
import kdImg from "./img/kd.png";
import personImg from "./img/person (2).png";

// import { useRef } from "react";
import "./index.less";

// const ref1 = useRef(null);

export default () => {
  const [op, setOp] = useState(null);

  const chartRef = useRef(null);

  const isLoadingRef = useRef(false);
  const lastRequestTimeRef = useRef(0); // 记录上一次请求完成时间
  const lastResponseTimeRef = useRef(null); // 记录上一次请求传递的时间
  // const intervalRef = (useRef < Number) | (null > null);

  const THROTTLE_DELAY = 3000; // 节流间隔
  const [dataOps, setDate] = useState([]);
  const [legend, setLegend] = useState([]);

  const formatDataStrict = (str) => {
    if (!str) return [];
    return str
      .replaceAll("x", "")
      .split("y")
      .map((item) => Number(item));
  };

  // getData();
  const intervalRef = useRef(null);
  const getData = async () => {
    const now = Date.now();
    // 检查：是否正在请求，或距离上次请求完成不足节流间隔
    if (
      isLoadingRef.current ||
      now - lastRequestTimeRef.current < THROTTLE_DELAY
    ) {
      return;
    }
    isLoadingRef.current = true;
    //获取设备属性
    try {
      const res = await getDeviceOptions({
        isNewOption: true,
        createTime: lastResponseTimeRef.current,
      });
      if (res?.code == 200 && res?.data?.length) {
        console.log("AAA", res.data);

        const tableData = res.data.map((item) => {
          return {
            ...item,
            xy: formatDataStrict(item.p1),
          };
        });
        console.log("BBB", tableData);
        setDate(tableData);
        setLegend(tableData.map((item) => item.serviceId));
        lastResponseTimeRef.current = res.data[0].createTime;
        // config.data = config.data.concat(tableData);
        // setConfigDate({ ...config });
      }
    } catch (error) {
      console.error("请求失败", error);
    } finally {
      isLoadingRef.current = false;
      lastRequestTimeRef.current = Date.now(); // 更新上次请求完成时间
    }
  };
  // 2. 定义图表样式（可选，可通过 CSS 控制）
  const chartStyle = {
    width: "200px",
    height: "200px" /* 宽高像素相同 */,
    margin: "20px auto",
    border: "1px solid #eee" /* 边框辅助观察正方形 */,
    zIndex: "12222",
  };

  const getOption = () => {
    return {
      // title: { text: "实时信息" },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          // params 包含当前数据点的所有信息
          // var xValue = params.name; // X轴坐标（对应xAxis的data）
          var yValue = params.value; // Y轴坐标（对应series的data值）
          // 自定义提示框内容，换行用<br/>
          return (
            "坐标信息: [" +
            yValue +
            "] <br/> " +
            "设备: [" +
            params.seriesName +
            "]"
          );
        },
      },
      legend: {
        data: legend,
      },
      // 2. 网格留出边框，避免内容溢出
      grid: {
        left: "5%",
        right: "5%",
        top: "5%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: {
        // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        type: "value",
        min: -50,
        max: 50,
        // 刻度间隔相等（每10单位一个刻度）
        interval: 10,
        splitLine: { show: false },
        axisLine: { show: false }, // 隐藏坐标轴线
        axisLabel: { show: false }, // 隐藏坐标轴标签
      },
      yAxis: {
        type: "value",
        min: -50,
        max: 50, // 刻度间隔相等（每10单位一个刻度）
        interval: 10,
        splitLine: { show: false },
        axisLine: { show: false }, // 隐藏坐标轴线
        axisLabel: { show: false }, // 隐藏坐标轴标签
      },
      graphic: [
        {
          type: "image",
          id: "bgImage",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          z: -10,
          silent: true,
          // 使用 style.width/style.height 将图片铺满画布区域，保持长宽比
          style: {
            image: kdImg,
            width: "100%",
            height: "100%",
            keepAspect: true,
            opacity: 1,
          },
        },
      ],
      // 3. 关键：通过polar/aspectScale强制等比例（仅对数值轴有效）
      // 注意：如果是类目轴（category），此配置无效
      // polar: {
      //   aspectScale: 1, // 强制X/Y轴单位长度比为1:1
      // },
      series: dataOps?.map((item) => ({
        name: item.serviceId,
        type: "scatter",
        data: [item.xy],
        symbol: `image://${personImg}`,
        symbolSize: 104,
        symbolKeepAspect: true,
      })),
    };
  };

  const options = {
    title: {
      show: true,
      text: "周销售额趋势",
    },
    legend: {
      data: ["系列A", "系列B", "系列C"],
    },
    xAxis: {
      data: "value",
      splitLine: { show: false },
      axisLine: { show: false }, // 隐藏坐标轴线
      axisLabel: { show: false }, // 隐藏坐标轴标签
      min: -50,
      max: 50,
      // 刻度间隔相等（每10单位一个刻度）
      interval: 10,
      // show: false,
    },
    yAxis: {
      data: "value",
      splitLine: { show: false },
      axisLine: { show: false }, // 隐藏坐标轴线
      axisLabel: { show: false }, // 隐藏坐标轴标签
      // show: false,
    },
    series: [
      {
        name: "系列A",
        data: [
          [0, 0],
          [2, 3],
          [4, 1],
          [6, 4],
          [8, 3],
          [10, 5],
          [12, 4],
        ],
        // symbolImage: `https://ts1.tc.mm.bing.net/th/id/R-C.987f582c510be58755c4933cda68d525?rik=C0D21hJDYvXosw&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1305%2f16%2fc4%2f20990657_1368686545122.jpg&ehk=netN2qzcCVS4ALUQfDOwxAwFcy41oxC%2b0xTFvOYy5ds%3d&risl=&pid=ImgRaw&r=0`, // 使用图片作为标记
        // symbol: `image://https://ts1.tc.mm.bing.net/th/id/R-C.987f582c510be58755c4933cda68d525?rik=C0D21hJDYvXosw&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1305%2f16%2fc4%2f20990657_1368686545122.jpg&ehk=netN2qzcCVS4ALUQfDOwxAwFcy41oxC%2b0xTFvOYy5ds%3d&risl=&pid=ImgRaw&r=0`, // 使用图片作为标记
        // symbolSize: [30, 30], // 必须显式设置大小，否则图片可能被压缩为0
        // symbolKeepAspect: true, // 保持图片宽高比（关键！）
        // lineStyle: { width: 22, color: "#409eff" },
        // itemStyle: {
        //   color: "transparent", // 隐藏默认节点颜色
        // },
        type: "line",
        stack: "a",
        fill: {
          show: true,
        },
      },
      {
        name: "系列B",
        data: [1200, 2230, 1900, 2100, 3500, 4200, 3985],
        type: "line",
        stack: "a",
        smooth: true,
        lineStyle: {
          show: false,
          lineWidth: 11,
          lineColor: "#ff7f50",
        },
        linePoint: {
          // symbol:
          //   "image://https://ts1.tc.mm.bing.net/th/id/R-C.987f582c510be58755c4933cda68d525?rik=C0D21hJDYvXosw&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1305%2f16%2fc4%2f20990657_1368686545122.jpg&ehk=netN2qzcCVS4ALUQfDOwxAwFcy41oxC%2b0xTFvOYy5ds%3d&risl=&pid=ImgRaw&r=0",
          // symbolSize: 6,
          radius: 6,
          style: {
            fill: "#fff",
            // lineWidth: 21,
            // symbol:
            //   "image://https://ts1.tc.mm.bing.net/th/id/R-C.987f582c510be58755c4933cda68d525?rik=C0D21hJDYvXosw&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1305%2f16%2fc4%2f20990657_1368686545122.jpg&ehk=netN2qzcCVS4ALUQfDOwxAwFcy41oxC%2b0xTFvOYy5ds%3d&risl=&pid=ImgRaw&r=0",
          },
        },
      },
      {
        name: "系列C",
        data: [1200, 2230, 1900, 2100, 3500, 4200, 3985],
        type: "line",
        stack: "a",
        lineStyle: {
          lineWidth: 0.0001,
          // lineDash: [5, 5],
        },
        linePoint: {
          radius: 6,
          style: {
            fill: "#fff",
            lineWidth: 21,
          },
        },
      },
    ],
  };

  //   // 在组件挂载时启动定时器并在卸载时清理，避免在每次渲染中重复创建
  useEffect(() => {
    // 先立即拉取一次（useEffect 外也有一次调用，但保障性拉取）
    getData();
    intervalRef.current = window.setInterval(() => {
      getData();
    }, THROTTLE_DELAY);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure eCharts resizes after mount and on window resize (fix small rendering)
  useEffect(() => {
    const resizeChart = () => {
      try {
        if (chartRef.current && chartRef.current.getEchartsInstance) {
          chartRef.current.getEchartsInstance().resize();
        }
      } catch (e) {
        // ignore
      }
    };
    const timeoutId = setTimeout(resizeChart, 300);
    window.addEventListener("resize", resizeChart);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", resizeChart);
    };
  }, []);
  return (
    <div id="data-view">
      <FullScreenContainer>
        <TopHeader />

        <div className="main-content">
          <DigitalFlop />

          <div className="block-left-right-content">
            <div className="left-chart">
              <ReactECharts
                ref={chartRef}
                echarts={echarts} // 传入 ECharts 核心库
                option={getOption()} // 传入配置项
                style={{ width: "100%", height: "85%" }}
                theme="light"
              />
            </div>

            <div className="block-top-bottom-content">
              <div className="block-top-content">
                {/* <RoseChart /> */}

                <WaterLevelChart />
                <ScrollBoard />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              ></div>
              {/* <Cards /> */}
            </div>
          </div>
        </div>
      </FullScreenContainer>
    </div>
  );
};
