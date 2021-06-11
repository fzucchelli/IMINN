import React from "react";
import { Drawer } from "antd";
import { useContext } from "react";
import { MenuCtx } from "@components";

const SideDrawerWrapper = ({ children }) => {
  const mc = useContext(MenuCtx);

  return (
    <Drawer
      placement="left"
      closable
      onClose={() => mc && mc?.setSideDrawer(false)}
      visible={(mc && mc?.sideDrawer) || false}
      getContainer={false}
      style={{ position: "absolute" }}
    >
      {children}
    </Drawer>
  );
};

export default SideDrawerWrapper;
