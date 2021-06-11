import "antd/dist/antd.less";
import React, { useEffect, useState } from "react";
import { useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper } from "../redux/store/configureStore";
import { initializeTheme } from "../utils/commonFunctions";
import { MenuCtx } from "@components";
import "../styles/commonStyles.module.less";

const App = ({ Component, pageProps }) => {
  const store = useStore((state) => state);
  const [activeMenu, setActiveMenu] = useState(1);
  const [sideDrawer, setSideDrawer] = useState(false);

  useEffect(() => {
    initializeTheme();
  }, []);

  useEffect(() => {
    if (sideDrawer) {
      document.body.style = "overflow: hidden";
    } else {
      document.body.style = "overflow:auto";
    }
  }, [sideDrawer]);

  return (
    <PersistGate persistor={store.__persistor} loading={<div>...Loading</div>}>
      <MenuCtx.Provider
        value={{
          active: activeMenu,
          setActiveMenu: setActiveMenu,
          sideDrawer: sideDrawer,
          setSideDrawer: setSideDrawer,
        }}
      >
        <Component {...pageProps} />
      </MenuCtx.Provider>
    </PersistGate>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  // Keep in mind that this will be called twice on server, one for page and second for error page
  ctx.store.dispatch({ type: "APP", payload: "was set in _app" });
  return {
    pageProps: {
      // Call page-level getInitialProps
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
      // Some custom thing for all pages
      appProp: ctx.pathname,
    },
  };
};

export default wrapper.withRedux(App);
