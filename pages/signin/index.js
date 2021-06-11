/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useLayoutEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useMediaQuery from "utils/useMediaQuery";
import Images from "@config/images";
import firebase from "firebase";
import db from "@config/firebaseConfig";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  notification,
} from "antd";
import { isEmpty } from "lodash";
import { getUpdatedUser } from "utils/commonFunctions";
import { useSelector } from "react-redux";
import { PageLoading } from "@components";
import TextInput from "@components/UI/TextInput";
import "./styles.module.less";

function Signin() {
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();
  const { isXs, isMd, isSm } = useMediaQuery();
  const [form] = Form.useForm();
  const [pageLoader, setPageLoader] = useState(true);

  const [formSwitch, setFormSwitch] = useState(true); // true for login Form, False for signup Form
  const [termscheck, setTermscheck] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useLayoutEffect(() => {
    if (!isEmpty(token)) {
      router.replace("/");
    } else {
      setPageLoader(false);
    }
  }, []);

  useEffect(() => {
    form.resetFields();
    setTermscheck(false);
  }, [formSwitch]);

  const checkBoxValidation = (rule, value) => {
    return new Promise((resolve, reject) => {
      if (termscheck || formSwitch) {
        resolve(true);
      }
      reject("Please accept the terms and conditions");
    });
  };

  const onFinish = (values) => {
    if (formSwitch) {
      handleSignin(values);
    } else {
      handleSignup(values);
    }
  };

  const handleSignin = async ({ email, password }) => {
    if (btnLoading) return;
    setBtnLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (!userCredential.user.displayName) {
          router.replace("/create-profile");
          setBtnLoading(false);
        } else {
          getUpdatedUser(userCredential.user, (res) => {
            if (res) {
              setBtnLoading(false);
              router.replace("/");
            } else {
              setBtnLoading(false);
              message.error("Oops! Something went wrong.");
            }
          });
        }
      })
      .catch((error) => {
        console.error("Signin Failed", error);
        notification.error({
          message: "Oops!",
          description: error.message,
        });
        setBtnLoading(false);
      });
  };

  const handleSignup = ({ email, password }) => {
    if (btnLoading) return;
    setBtnLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        createNewUser(userCredential);
        handleSignin({ email, password }); //Directly Login After creating an account
      })
      .catch((error) => {
        console.error("Signup Failed", error);
        notification.error({
          message: "Oops!",
          description: error.message,
        });
        setBtnLoading(false);
      });
  };

  const createNewUser = async (uData) => {
    const data = {
      userId: uData.user.uid,
      email: uData.user.email,
    };
    db.collection("users").doc(data.userId).set(data);
  };

  const renderMobileView = () => {
    return (
      <div className="mobileContainer2">
        <div className="roundcontainer2">
          <div className="logoContainer2">
            <img
              src={Images.brandLogoLight}
              alt="logo"
              className="logo-light-img"
            />
            <span className="logoText-light bigText">IMINN</span>
          </div>
          <p className="subTitleText2">
            {formSwitch ? "Welcome back to IMINN!" : "Welcome to IMINN!"}
          </p>
          <p className="titleText2">
            {formSwitch ? "Let's Login!" : "Let's Signup!"}
          </p>
        </div>
        <div className="formContainer2">
          <Form form={form} onFinish={onFinish} wrapperCol={{ span: 24 }}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email is required!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <TextInput placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password is required!" }]}
            >
              <TextInput passwordType placeholder="Enter your password" />
            </Form.Item>
            <Form.Item name="terms" rules={[{ validator: checkBoxValidation }]}>
              <Checkbox
                onChange={(e) => setTermscheck(e.target.checked)}
                checked={termscheck}
              >
                {formSwitch
                  ? "Remember my credentials"
                  : "Accept terms and conditions"}
              </Checkbox>
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button
                loading={btnLoading}
                type="primary"
                size="large"
                htmlType="submit"
                shape="round"
              >
                {formSwitch ? "LOGIN" : "SIGNUP"}
              </Button>
            </Form.Item>
            {!formSwitch && (
              <>
                <Form.Item>
                  <Divider>OR USING</Divider>
                </Form.Item>
                <Form.Item>
                  <div className="socialLoginContainer">
                    <span className="socialLoginButtons googleBtn">
                      <img src={Images.google} height="100%" width="auto" />
                    </span>
                    <span className="socialLoginButtons">
                      <img src={Images.facebook} height="100%" width="auto" />
                    </span>
                  </div>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
        <div className="bottomText">
          {formSwitch ? (
            <span className="noSelect">
              Don't have an account yet?
              <a onClick={() => setFormSwitch(!formSwitch)}> Signup!</a>
            </span>
          ) : (
            <span className="noSelect">
              Already have an account?
              <a onClick={() => setFormSwitch(!formSwitch)}> Login!</a>
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderNormalView = () => {
    return (
      <div className="fullContainerView">
        <img src={Images.football} className="cornerImg" />
        <div className="leftDiv">
          <p className="titleText2">
            Let's Climb the Highest Ranking in Your City.
          </p>
          <p className="subTitleText2">
            Explore the game that will make you a superstars amongs thousands of
            players in your city. Awesome game, awesome you!
          </p>
        </div>
        <div className="rightDiv">
          <div className="colFlex allCenter" style={{ flex: 6 }}>
            <div className="logoContainer2">
              <img src={Images.brandLogo} alt="logo" />
              <span className="logoText fLogoText2">IMINN</span>
            </div>
            <div className="welcomeTextSmall">
              {formSwitch ? "Welcome back to IMINN!" : "Welcome to IMINN!"}
            </div>
            <div className="welcomeTextBig bold">
              {formSwitch ? "Let's Login!" : "Let's Signup!"}
            </div>
          </div>
          <div className="bottomFlexDiv">
            <div className="formContainerLg">
              <Form
                form={form}
                className="form"
                onFinish={onFinish}
                wrapperCol={{
                  span: isMd || isSm ? 16 : 10,
                  offset: isMd || isSm ? 4 : 7,
                }}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Email is required!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <TextInput placeholder="Enter your email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Password is required!" }]}
                >
                  <TextInput passwordType placeholder="Enter your password" />
                </Form.Item>
                <Form.Item
                  name="terms"
                  rules={[{ validator: checkBoxValidation }]}
                >
                  <Checkbox
                    onChange={(e) => setTermscheck(e.target.checked)}
                    checked={termscheck}
                  >
                    {formSwitch
                      ? "Remember my credentials"
                      : "Accept terms and conditions"}
                  </Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={btnLoading}
                    type="primary"
                    size="large"
                    htmlType="submit"
                    shape="round"
                    block
                  >
                    {formSwitch ? "LOGIN" : "SIGNUP"}
                  </Button>
                </Form.Item>
                {!formSwitch && (
                  <>
                    <Form.Item>
                      <Divider>OR USING</Divider>
                    </Form.Item>
                    <Form.Item>
                      <div className="socialLoginContainer">
                        <span className="socialLoginButtons googleBtn">
                          <img src={Images.google} height="100%" width="auto" />
                        </span>
                        <span className="socialLoginButtons">
                          <img
                            src={Images.facebook}
                            height="100%"
                            width="auto"
                          />
                        </span>
                      </div>
                    </Form.Item>
                  </>
                )}
              </Form>
            </div>
            <div className="bottomText">
              {formSwitch ? (
                <span className="noSelect">
                  Don't have an account yet?
                  <a onClick={() => setFormSwitch(!formSwitch)}> Signup!</a>
                </span>
              ) : (
                <span className="noSelect">
                  Already have an account?
                  <a onClick={() => setFormSwitch(!formSwitch)}> Login!</a>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (pageLoader) return <PageLoading />;

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Iminn - Get early access</title>
      </Head>
      {isXs ? renderMobileView() : renderNormalView()}
    </>
  );
}

export default Signin;
