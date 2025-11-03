import { getDeviceOptions } from "@/services/ant-design-pro/api";
import { PageContainer } from "@ant-design/pro-components";

import * as echarts from "echarts"; // 引入 ECharts 核心库
import ReactECharts from "echarts-for-react"; // ECharts React 组件
import React, { useEffect, useRef, useState } from "react";

const HistoryTable: React.FC = () => {
  const [data, setData] = useState<any>({});

  // 使用 useRef 保存跨渲染的可变变量，避免每次渲染重置
  const isLoadingRef = useRef(false);
  const lastRequestTimeRef = useRef(0); // 记录上一次请求完成时间
  const THROTTLE_DELAY = 10000; // 节流间隔
  const intervalRef = useRef<number | null>(null);

  function formatDataStrict(str: string) {
    if (!str) {
      return [];
    }
    // 严格匹配 x(带符号数字)y(带符号数字)
    // 严格匹配 x(正负整数/小数)y(正负整数/小数)
    const reg = /x([+-]?\d+(\.\d+)?)y([+-]?\d+(\.\d+)?)/;
    const match = str.match(reg);
    // 匹配成功则转为数字数组，失败返回空数组
    return match ? [Number(match[1]), Number(match[3])] : [];
  }
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
      const res = await getDeviceOptions();
      const p1: any[] = [];
      const p2: any[] = [];
      const p3: any[] = [];
      if (res?.code == 200 && res?.data?.length) {
        res.data.forEach((item: any) => {
          // const a1 = item?.p1
          //   ?.replaceAll("x", "")
          //   .replaceAll("y", "")
          //   .split(",");
          // const a2 = item?.p2
          //   ?.replaceAll("x", "")
          //   .replaceAll("y", "")
          //   .split(",");
          // const a3 = item?.p3
          //   ?.replaceAll("x", "")
          //   .replaceAll("y", "")
          //   .split(",");
          const a1 = formatDataStrict(item?.p1);
          const a2 = formatDataStrict(item?.p2);
          const a3 = formatDataStrict(item?.p3);
          p1.push(a1);
          p2.push(a2);
          p3.push(a3);
        });

        setData({ p1, p2, p3 });

        // setData(res.data);
      }
    } catch (error) {
      console.error("请求失败", error);
    } finally {
      isLoadingRef.current = false;
      lastRequestTimeRef.current = Date.now(); // 更新上次请求完成时间
    }
  };

  // const getDeviceSelect = async () => {
  //   const res = await getDeviceList();
  //   if (res?.code == 200 && res?.data) {
  //     const resData = res.data?.devices?.map((item: any) => ({
  //       label: item.device_name,
  //       value: item.device_id,
  //     }));
  //     setDeviceList(resData);
  //   }
  // };

  useEffect(() => {
    // getDeviceSelect();
    getData();
  }, []);
  const getOption = () => {
    return {
      title: { text: "实时信息" },
      tooltip: {
        trigger: "item",
        formatter: function (params: { value: any }) {
          // params 包含当前数据点的所有信息
          // var xValue = params.name; // X轴坐标（对应xAxis的data）
          var yValue = params.value; // Y轴坐标（对应series的data值）
          // 自定义提示框内容，换行用<br/>
          return "坐标信息: [" + yValue + "] <br/> ";
        },
      },
      legend: {
        data: ["P1", "P2", "P3"],
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
        type: "value",
        min: -50,
        max: 50,
        interval: 10,
      },
      interval: 10,
      yAxis: { type: "value", min: -50, max: 50 },
      series: [
        {
          name: "P1",
          type: "line",
          data: data?.p1,
        },
        {
          name: "P2",
          type: "line",
          data: data?.p2,
        },
        {
          name: "P3",
          type: "line",
          data: data?.p3,
        },
      ],
    };
  };

  // 2. 定义图表样式（可选，可通过 CSS 控制）
  const chartStyle = {
    width: "75vh",
    height: "75vh" /* 宽高像素相同 */,
    margin: "20px auto",
    border: "1px solid #eee" /* 边框辅助观察正方形 */,
  };

  // 在组件挂载时启动定时器并在卸载时清理，避免在每次渲染中重复创建
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

  return (
    <PageContainer>
      <ReactECharts
        echarts={echarts} // 传入 ECharts 核心库
        option={getOption()} // 传入配置项
        style={chartStyle} // 图表样式
        theme="light" // 主题（可选：'light'/'dark' 或自定义主题）
        onEvents={{
          // 绑定事件（如点击）
          click: (params: any) => console.log("点击事件", params),
        }}
      />
    </PageContainer>
  );
};

export default HistoryTable;
