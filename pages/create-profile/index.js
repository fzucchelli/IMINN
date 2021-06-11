/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import Head from "next/head";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import useMediaQuery from "utils/useMediaQuery";
import Images from "@config/images";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Upload,
} from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { useRouter } from "next/router";
import {
  getActiveSource,
  getBase64,
  uploadPhoto,
  validateImage,
} from "utils/commonFunctions";
import { roles } from "@config/staticData";
import { isEmpty, set } from "lodash";
import db from "@config/firebaseConfig";
import { BackIcon } from "@components/UI/Icons";
import AuthActions from "@redux/reducers/auth/actions";
import "./styles.module.less";
import { useAuthState } from "react-firebase-hooks/auth";
import { PageLoading } from "@components";
import TextInput from "@components/UI/TextInput";

const { setUserData } = AuthActions;
const dateFormat = "DD/MM/YYYY";

function CreateProfile() {
  const dispatch = useDispatch();
  const { isXs, isMd, isSm } = useMediaQuery();
  const [form] = Form.useForm();
  const router = useRouter();
  const [pageLoader, setPageLoader] = useState(true);
  const [profileForm, setProfileForm] = useState(true); //render condtion
  const [profilePic, setProfilePic] = useState(""); // to be uploaded
  const [picBase64, setPicBase64] = useState(""); // to display preview
  const [selectedRole, setSelectedRole] = useState({}); // to display preview
  const [btnLoading, setBtnLoading] = useState(false); //Btn
  const [user, loading, error] = useAuthState(firebase.auth());

  //For Mobile View selected Role
  const [activeRolePage, setActiveRolePage] = useState(0);

  useEffect(() => {
    if (!isEmpty(user)) {
      console.log("IN CREATE PROFILE --> ", user?.displayName);
      user.displayName !== null ? router.push("/") : setPageLoader(false);
    }
  }, [user]);

  const handleProfileImage = async (info) => {
    const imageVal = validateImage(info);
    if (imageVal) {
      setProfilePic(info);
      getBase64(info, (imgUrl) => {
        setPicBase64(imgUrl);
      });
    }
  };

  const submitForm = async (isMobile = false) => {
    // const user = firebase.auth().currentUser;
    setBtnLoading(true);
    const userObject = {
      firstName: form.getFieldValue("firstName"),
      lastName: form.getFieldValue("lastName"),
      dob: form.getFieldValue("dob").format(dateFormat),
      role: selectedRole.name,
    };

    if (isMobile) {
      userObject.role = roles[activeRolePage].name;
    }

    try {
      const res = await uploadPhoto(profilePic, user.uid);
      userObject.profileImage = res;
    } catch (error) {
      message.error(error.message);
      console.error(error);
      setBtnLoading(false);
    }

    user
      .updateProfile({
        displayName:
          form.getFieldValue("firstName") +
          " " +
          form.getFieldValue("lastName"),
      })
      .then(() => console.log("updated auth profile"))
      .catch((e) => {
        message.error(e.message);
        console.error(e);
      });

    db.collection("users")
      .doc(user.uid)
      .update(userObject)
      .then(() => {
        dispatch(setUserData(user, userObject));
        router.replace("/");
      })
      .catch((e) => {
        message.error(e.message);
        console.error(e);
        setBtnLoading(false);
      });
  };

  const onFinish = () => {
    setProfileForm(false);
  };

  const handleContinue = () => {
    if (isEmpty(selectedRole)) {
      message.warning("Please select a role");
      return;
    }
    submitForm();
  };

  const handlePage = (isNext) => {
    //handle Role selected page for Mobile
    if (isNext) {
      setActiveRolePage(activeRolePage + 1);
    } else {
      setActiveRolePage(activeRolePage - 1);
    }
  };

  const handleRole = (item) => {
    setSelectedRole(item);
  };

  const renderRole = () => {
    return (
      <>
        <Row className="roleContainerLg" justify="center" align="middle">
          <Col span={14} className="colFlex allCenter">
            <span className="stepTitle">Create Profile</span>
            <Row justify="center" align="middle" className="mt-2 mb-3">
              <Col className="textCenter">
                <span className="rolteTitle primaryColor">
                  Select a Role that's <br />
                  Fit with you!
                </span>
              </Col>
            </Row>
            <Row justify="center" align="middle" gutter={[16, 48]}>
              {roles.map((item) => {
                const isActive = selectedRole?.id === item.id;
                return (
                  <Col span={12} className="textCenter" key={item.id}>
                    <div
                      className="roleButton colFlex allCenter"
                      onClick={() => handleRole(item)}
                    >
                      <span
                        className={`roleName ${isActive && "primaryColor"}`}
                      >
                        {item.name}
                      </span>
                      <img
                        className="roleImg"
                        src={getActiveSource(item.icon, isActive)}
                      />
                    </div>
                  </Col>
                );
              })}
            </Row>
            <Row
              justify="center"
              align="middle"
              gutter={[16, 48]}
              className="w100 mt-2"
            >
              <Col span={16}>
                <Button
                  loading={btnLoading}
                  className="confirmBtn"
                  type="primary"
                  size="large"
                  shape="round"
                  onClick={() => (btnLoading ? null : handleContinue())}
                  block
                >
                  CONTINUE
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  const renderRoleMobile = () => {
    return (
      <div className="mobileContainer2">
        <div className="roundcontainer3" style={{ flex: 4 }}>
          <Row className="titleRow">
            <BackIcon
              className="backBtnMobile"
              onClick={() => {
                setProfileForm(true);
              }}
            />
            <span className="stepTitle-mb">Create Profile</span>
          </Row>
          <span className="tilte-mb">
            Select a Role that's <br />
            Fit with you!
          </span>
        </div>
        <div
          className="formContainer3"
          style={{
            flex: 8,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Row
            justify="center"
            align="middle"
            className="w100"
            style={{ flex: 1 }}
          >
            <Col span={1}>
              {activeRolePage > 0 && (
                <ArrowLeftOutlined
                  className="arrowIcons"
                  onClick={() => handlePage(false)}
                />
              )}
            </Col>
            <Col span={22} className="colFlex allCenter">
              <span className="roleTitle-mb">{roles[activeRolePage].name}</span>
            </Col>
            <Col span={1}>
              {activeRolePage < roles.length - 1 && (
                <ArrowRightOutlined
                  className="arrowIcons"
                  onClick={() => handlePage(true)}
                />
              )}
            </Col>
          </Row>
          <Row
            justify="center"
            align="middle"
            className="w100"
            style={{ flex: 4 }}
          >
            <img
              className="roleImg"
              src={getActiveSource(roles[activeRolePage].icon, true)}
            />
          </Row>
          <Row style={{ flex: 1, justifyContent: "flex-start" }}>
            <Button
              type="primary"
              size="large"
              shape="round"
              loading={btnLoading}
              onClick={() => submitForm(true)}
            >
              SELECT
            </Button>
          </Row>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <>
        <div className="profileContainerLg">
          <Form
            form={form}
            className="form"
            onFinish={onFinish}
            wrapperCol={{
              span: isMd || isSm ? 16 : 10,
              offset: isMd || isSm ? 4 : 7,
            }}
          >
            <Form.Item style={{ textAlign: "center" }}>
              <span className="stepTitle">Create Profile</span>
            </Form.Item>
            <Form.Item>
              <ImgCrop rotate>
                <Upload
                  showUploadList={false}
                  beforeUpload={handleProfileImage}
                >
                  <div className="uploadBtnContainer">
                    <Avatar
                      size={130}
                      src={picBase64}
                      icon={<UserOutlined />}
                      style={{ cursor: "pointer" }}
                    />
                    <a className="uploadText">Change Image</a>
                  </div>
                </Upload>
              </ImgCrop>
            </Form.Item>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Please enter your name." }]}
            >
              <TextInput placeholder="Enter your name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[
                { required: true, message: "Please enter your surname." },
              ]}
            >
              <TextInput placeholder="Enter your surname" />
            </Form.Item>
            <Form.Item
              name="dob"
              rules={[
                { required: true, message: "Please enter your date of birth." },
              ]}
            >
              <DatePicker
                allowClear={false}
                inputReadOnly
                placeholder="Enter your date of birth"
                size="large"
                format={dateFormat}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="confirmBtn"
                type="primary"
                size="large"
                htmlType="submit"
                shape="round"
                block
              >
                CONTINUE
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    );
  };

  const renderProfileMobile = () => {
    return (
      <div className="mobileContainer2">
        <div className="roundcontainer3">
          <span className="stepTitle-mb">Create Profile</span>
          <ImgCrop rotate>
            <Upload showUploadList={false} beforeUpload={handleProfileImage}>
              <div className="uploadBtnContainer">
                <Avatar
                  size={isXs ? 100 : 130}
                  src={picBase64}
                  icon={<UserOutlined />}
                  style={{ cursor: "pointer" }}
                />
                <a className="uploadText">Change Image</a>
              </div>
            </Upload>
          </ImgCrop>
        </div>
        <div className="formContainer3">
          <Form
            form={form}
            className="form"
            onFinish={onFinish}
            wrapperCol={{ span: 24 }}
          >
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Please enter your name." }]}
            >
              <Input size="large" placeholder="Enter your name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[
                { required: true, message: "Please enter your surname." },
              ]}
            >
              <Input size="large" placeholder="Enter your surname" />
            </Form.Item>
            <Form.Item
              name="dob"
              rules={[
                { required: true, message: "Please enter your date of birth." },
              ]}
            >
              <DatePicker
                inputReadOnly
                allowClear={false}
                placeholder="Enter your date of birth"
                size="large"
                format={dateFormat}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="confirmBtn"
                type="primary"
                size="large"
                htmlType="submit"
                shape="round"
                block
              >
                CONTINUE
              </Button>
            </Form.Item>
          </Form>
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
          {profileForm ? renderProfile() : renderRole()}
        </div>
      </div>
    );
  };

  const renderMobileView = () => {
    if (profileForm) {
      return renderProfileMobile();
    } else {
      return renderRoleMobile();
    }
  };

  if (pageLoader) return <PageLoading />;

  if (error) {
    router.replace("/");
  }

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

export default CreateProfile;
