import { useEffect, useState } from "react";
import { Grid } from "antd";
const { useBreakpoint } = Grid;

export default function useMediaQuery() {
  const screens = useBreakpoint();
  const [currentPoint, setCurrentPoint] = useState("");

  useEffect(() => {
    let arr = Object.entries(screens).filter((screen) => {
      if (!!screen[1]) {
        return screen[1];
      }
    });
    let result = arr[arr.length - 1];
    if (result) {
      setCurrentPoint(result[0]);
    }
  }, [screens]);

  return {
    isXs: currentPoint === "xs" || false,
    isSm: currentPoint === "sm" || false,
    isMd: currentPoint === "md" || false,
    isLg: currentPoint === "lg" || false,
    isXl: currentPoint === "xl" || false,
    isXxl: currentPoint === "xxl" || false,
  };
}
