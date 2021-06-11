import React, { useContext } from "react";
import { Col, Drawer } from "antd";
import { Header, Sider, Games, CoverImg } from "@components";
import useMediaQuery from "utils/useMediaQuery";
import SideDrawerWrapper from "@components/UI/SideDrawerWrapper";

const DashboardView = () => {
  const { isXs, isSm } = useMediaQuery();

  if (isXs || isSm) {
    return (
      <>
        <SideDrawerWrapper>
          <Sider />
        </SideDrawerWrapper>
        <Col>
          <Header noDrawerBtn={false} />
          <CoverImg />
          {/* <Action /> */}
          <Games />
        </Col>
      </>
    );
  }

  return (
    <>
      <Col flex="4">
        <Sider />
      </Col>
      <Col flex="20" className="pl-2">
        <Header />
        <CoverImg />
        {/* <Action /> */}
        <Games />
      </Col>
    </>
  );
};

export default DashboardView;
