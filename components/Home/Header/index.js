import React, { useContext, useMemo } from "react";
import p from "prop-types";
import { Affix, Avatar, Col, Popover, Row } from "antd";
import Text from "@components/UI/Text";
import {
  HeartOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  AwardIcon,
  BellIcon,
  DropArrow,
  InboxIcon,
  MoonIcon,
  PlusIcon,
  RankIcon,
  SunIcon,
  LogoutIcon,
} from "@components/UI/Icons";
import Searchbar from "@components/UI/Searchbar";
import { useSelector } from "react-redux";
import { useState } from "react";
import { MenuCtx } from "@components";
import {
  getActiveTheme,
  getInitials,
  signOut,
  switchTheme,
} from "utils/commonFunctions";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import "./styles.module.less";
import useMediaQuery from "utils/useMediaQuery";

function Header(props) {
  const { noSearch, noDrawerBtn, extraBtn } = props;
  const { isXs, isSm } = useMediaQuery();

  const { userData } = useSelector((state) => state.auth);
  const router = useRouter();
  const mc = useContext(MenuCtx);

  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const menuData = useMemo(() => {
    if (isEmpty(userData)) {
      return [
        {
          id: 4,
          name: "Change Theme",
          icon: getActiveTheme() === "light" ? <MoonIcon /> : <SunIcon />,
        },
        {
          id: 6,
          name: "Signin",
          icon: <LogoutIcon className="logoutIconProfileMenu" />,
        },
      ];
    }

    return [
      {
        id: 1,
        name: "Legend",
        icon: <AwardIcon />,
      },
      {
        id: 2,
        name: "928",
        icon: <RankIcon />,
      },
      {
        id: 3,
        name: "Edit Profile",
        icon: <PlusIcon />,
      },
      {
        id: 4,
        name: "Change Theme",
        icon: getActiveTheme() === "light" ? <MoonIcon /> : <SunIcon />,
      },
      {
        id: 5,
        name: "Log Out",
        icon: <LogoutIcon className="logoutIconProfileMenu" />,
      },
    ];
  });

  const handleMenuClick = (item) => {
    if (item.id === 3) {
      console.log("route", router);
      router && router.pathname !== "/" && router.push("/");
      mc.setActiveMenu(7);
      setProfileMenuVisible(false);
      return;
    }
    if (item.id === 4) {
      switchTheme();
      setProfileMenuVisible(false);
      return;
    }
    if (item.id === 5) {
      signOut();
      setProfileMenuVisible(false);
      return;
    }
    if (item.id === 6) {
      router.push("/signin");
      setProfileMenuVisible(false);
      return;
    }
  };

  const DropDownContent = () => {
    return (
      <div>
        {menuData.map((m) => {
          return (
            <Row
              onClick={() => handleMenuClick(m)}
              justify="space-between"
              align="middle"
              key={m.id}
              className="profileMenuItem"
            >
              <Col>
                <div className="mr-2">{m.icon}</div>
              </Col>
              <Col>
                <Text semiBold primary>
                  {m.name}
                </Text>
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  const prop1 =
    isSm || isXs
      ? {
          xs: { span: 24, order: 2 },
          sm: { span: 24, order: 2 },
        }
      : {};
  const prop2 =
    isSm || isXs
      ? { xs: { span: 24, order: 1 }, sm: { span: 24, order: 1 } }
      : {};

  return (
    <div>
      <Affix offsetTop={0}>
        <Row justify="space-between" align="middle" className="affixHeader">
          <Col
            {...prop1}
            className={(isSm || isXs) && !noSearch && "mobileSearchbar"}
          >
            {!noSearch && <Searchbar />}
          </Col>
          <Col {...prop2}>
            <Row align="middle" className={(isSm || isXs) && "mobileHeader"}>
              {(isXs || isSm) && !noDrawerBtn && (
                <Col onClick={() => mc.setSideDrawer(true)}>
                  <MenuUnfoldOutlined className="headerMenu primaryColor" />
                </Col>
              )}
              {React.isValidElement(extraBtn) && <Col>{extraBtn}</Col>}
              <Col>
                <HeartOutlined className="headerMenu" />
              </Col>
              <Col>
                <InboxIcon className="headerMenu" />
              </Col>
              <Col>
                <BellIcon className="headerMenu" />
              </Col>
              <Col>
                <Popover
                  content={DropDownContent}
                  overlayClassName="profilePover noSelect"
                  trigger="hover"
                  placement="bottomRight"
                  visible={profileMenuVisible}
                  onVisibleChange={(visible) => setProfileMenuVisible(visible)}
                >
                  <Row
                    className={`headerMenuProfile ${
                      profileMenuVisible && "headerMenuProfile-active"
                    }`}
                  >
                    <Avatar
                      size={isSm || isXs ? 50 : 60}
                      icon={<UserOutlined />}
                      className={!isEmpty(userData) ? "primaryBg" : ""}
                      src={userData?.profileImage?.secure_url || ""}
                    >
                      {getInitials(userData)}
                    </Avatar>
                    <DropArrow className="headerMenuProfileDropIcon" />
                  </Row>
                </Popover>
              </Col>
            </Row>
          </Col>
        </Row>
      </Affix>
    </div>
  );
}

Header.defaultProps = {
  noSearch: false,
  noDrawerBtn: true,
  extraBtn: () => {},
};

Header.propTypes = {
  noSearch: p.bool,
  noDrawerBtn: p.bool,
  extraBtn: p.func,
};

export default Header;
