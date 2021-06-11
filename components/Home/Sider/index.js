/* eslint-disable react/prop-types */
import React, { isValidElement, useContext } from "react";
import { useRouter } from "next/router";
import { Affix, Col, Row } from "antd";
import Text from "@components/UI/Text";
import Card from "@components/UI/Card";
import { PlusOutlined } from "@ant-design/icons";
import { navMenus } from "@config/staticData";
import { HeaderLogo, MenuCtx } from "@components";
import "./styles.module.less";

const activeKey = 1;

function Sider(props) {
  const router = useRouter();
  const mc = useContext(MenuCtx);

  const { children, bottomFix } = props;

  const renderMenuItems = () => {
    return navMenus.map((m) => {
      return (
        <Row
          key={m.id}
          align="middle"
          className={`menuItem ${m.id == activeKey && "menuItem-active"}`}
        >
          <Col>
            <div className="menuIconWrapper">{m.icon}</div>
          </Col>
          <Col>
            <Text>{m.name}</Text>
          </Col>
        </Row>
      );
    });
  };

  const renderCommonSider = () => {
    return (
      <>
        <Col span={24}>
          <Row>
            <Card trans padding="25px" className="rowFlex alignCenter mb-2">
              <Text h4 bold className="robotoFamily">
                Create Game
              </Text>
              <Card
                className="plusButtonWrapper pointer"
                onClick={() => mc.setActiveMenu(6)}
              >
                <PlusOutlined className="plusButton" />
              </Card>
            </Card>
          </Row>
          {/* MENUS */}
          {renderMenuItems()}
        </Col>
      </>
    );
  };

  const handleLogoClick = () => {
    if (router.asPath == "/") {
      mc && mc?.setActiveMenu(1);
    } else {
      mc && mc?.setActiveMenu(1);
      router.push("/");
    }
  };

  return (
    <Affix offsetTop={16} className="siderContainer">
      <div className={!children ? "siderContainer pr-2" : "siderContainer"}>
        <Row align="top">
          <Col span={24} className="pointer" onClick={() => handleLogoClick()}>
            <HeaderLogo />
            {/* STATIC FOR ALL */}
          </Col>
          {children ? children : renderCommonSider()}
        </Row>
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
          }}
        >
          {isValidElement(bottomFix) && bottomFix}
        </div>
      </div>
    </Affix>
  );
}

export default Sider;
