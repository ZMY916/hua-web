import { ScrollBoard } from "@jiaminghi/data-view-react";

import { getDeviceOptions } from "@/services/ant-design-pro/api";
import { useEffect, useRef, useState } from "react";
import "./ScrollBoard.less";

const config = {
  header: ["时间", "人员", "当前位置"],
  data: [
    // ["2019-07-01 19:25:00", "路面危害-松散", "5"],
    // ["2019-07-02 17:25:00", "路面危害-路面油污清理", "13", "xxxxxxx"],
    // ["2019-07-03 16:25:00", "交安设施-交通标志牌结构", "6", "xxxxxxx"],
    // ["2019-07-04 15:25:00", "路基危害-防尘网", "2", "xxxxxxx"],
    // ["2019-07-05 14:25:00", "交安设施-交通标志牌结构", "1", "xxxxxxx"],
    // ["2019-07-06 13:25:00", "路面危害-松散", "3", "xxxxxxx"],
    // ["2019-07-07 12:25:00", "路基危害-防尘网", "4", "xxxxxxx"],
    // ["2019-07-08 11:25:00", "路面危害-路面油污清理", "2", "xxxxxxx"],
    // ["2019-07-09 10:25:00", "交安设施-交通标志牌结构", "5", "xxxxxxx"],
    // ["2019-07-10 09:25:00", "路基危害-防尘网", "3", "xxxxxxx"],
  ],
  index: true,
  columnWidth: [50, 170, 90],
  align: ["center"],
  rowNum: 10,
  headerBGC: "#1981f6",
  headerHeight: 45,
  waitTime: 1000,
  oddRowBGC: "rgba(0, 44, 81, 0.8)",
  evenRowBGC: "rgba(10, 29, 50, 0.8)",
};

export default () => {
  const isLoadingRef = useRef(false);
  const lastRequestTimeRef = useRef(0); // 记录上一次请求完成时间
  const lastResponseTimeRef = useRef(null); // 记录上一次请求传递的时间
  const intervalRef = useRef(null);

  const THROTTLE_DELAY = 10000; // 节流间隔
  const [configData, setConfigDate] = useState(config);

  // getData();
  //   const intervalRef = useRef<number | null>(null);
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
        isNewOption: false,
        createTime: lastResponseTimeRef.current,
      });
      if (res?.code == 200 && res?.data?.length) {
        const tableData = res.data.map((item) => [
          item.eventTime,
          item.serviceId,
          item.p1,
          // "",
        ]);
        lastResponseTimeRef.current = res.data[0].createTime;
        config.data = config.data.concat(tableData);
        setConfigDate({ ...config });
      }
      // const p1: any[] = [];
      // const p2: any[] = [];
      // const p3: any[] = [];
      // if (res?.code == 200 && res?.data?.length) {
      //   res.data.forEach((item: any) => {
      //     // const a1 = item?.p1
      //     //   ?.replaceAll("x", "")
      //     //   .replaceAll("y", "")
      //     //   .split(",");
      //     const a1 = formatDataStrict(item?.p1);
      //     const a2 = formatDataStrict(item?.p2);
      //     const a3 = formatDataStrict(item?.p3);

      //     // const a2 = item?.p2
      //     //   ?.replaceAll("x", "")
      //     //   .replaceAll("y", "")
      //     //   .split(",");
      //     // const a3 = item?.p3
      //     //   ?.replaceAll("x", "")
      //     //   .replaceAll("y", "")
      //     //   .split(",");
      //     p1.push(a1);
      //     p2.push(a2);
      //     p3.push(a3);
      //   });

      //   setData({ p1, p2, p3 });

      // setData(res.data);
      // }
    } catch (error) {
      console.error("请求失败", error);
    } finally {
      isLoadingRef.current = false;
      lastRequestTimeRef.current = Date.now(); // 更新上次请求完成时间
    }
  };

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
  // setInterval(() => {
  //   getData();
  //   // setConfigDate({ ...config });
  // }, 15000);
  return (
    <div id="scroll-board">
      <ScrollBoard config={configData} />
    </div>
  );
};
