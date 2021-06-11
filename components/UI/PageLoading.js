import React from "react";
import { Spin } from "antd";

const PageLoading = () => {
  return (
    <div className="colFlex allCenter" style={{ height: "100vh" }}>
      <Spin size="large" spinning />
    </div>
  );
};

export default PageLoading;
