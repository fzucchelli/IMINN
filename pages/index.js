import React, { useEffect } from "react";
import Head from "next/head";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Hero,
  Features,
  Work,
  Banner,
  Footer,
  PageLoading,
  Home,
} from "@components";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { getUpdatedUser } from "utils/commonFunctions";

function LandingPage() {
  const { token } = useSelector((state) => state.auth);
  const [user, loading] = useAuthState(firebase.auth());

  useEffect(() => {
    if (user) {
      getUpdatedUser(user);
    }
  }, [user]);

  if (isEmpty(token) && loading) return <PageLoading />;

  //! Not Logged In -> Show Redirect to Dashboard
  if (!isEmpty(token)) return <Home />;

  //! Not Logged In -> Show Landign Page
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Iminn - Get early access</title>
      </Head>
      <div>
        <Hero />
        <Features />
        <Work />
        <Banner />
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
