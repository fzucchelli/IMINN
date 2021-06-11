import React, { useContext } from "react";
import Head from "next/head";
import { Row } from "antd";
import { Sider, MenuCtx, ProfileEdit, DashboardView } from "@components";
import CreateGame from "./CreateGame";
import { useSelector } from "react-redux";
import "./styles.module.less";

function Home() {
  const { theme } = useSelector((state) => state.theme);
  const mc = useContext(MenuCtx);
  // CUSTOM VIEWS

  const StatsView = () => (
    <>
      <div style={{ flex: 4 }}>
        <Sider />
      </div>
      <div style={{ flex: 20 }} className="pl-2">
        Coming Soon
      </div>
    </>
  );

  const RatesView = () => (
    <>
      <div style={{ flex: 4 }}>
        <Sider />
      </div>
      <div style={{ flex: 20 }} className="pl-2">
        Coming Soon
      </div>
    </>
  );

  const SettingsView = () => (
    <>
      <div style={{ flex: 4 }}>
        <Sider />
      </div>
      <div style={{ flex: 20 }} className="pl-2">
        Coming Soon
      </div>
    </>
  );

  const MatchesView = () => (
    <>
      <div style={{ flex: 4 }}>
        <Sider />
      </div>
      <div style={{ flex: 20 }} className="pl-2">
        Coming Soon
      </div>
    </>
  );

  const renderContent = () => {
    let th = theme; //! IMPORTANT: Do not remove. Used for rerender on theme Change
    switch (mc.active) {
      case 1:
        return <DashboardView />;
      case 2:
        return <StatsView />;
      case 3:
        return <RatesView />;
      case 4:
        return <SettingsView />;
      case 5:
        return <MatchesView />;
      case 6:
        return <CreateGame />;
      case 7:
        return <ProfileEdit />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Iminn - Get early access</title>
      </Head>
      <Row className="layoutContainer">{renderContent()}</Row>
    </>
  );
}

export default Home;
