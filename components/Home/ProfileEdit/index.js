/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Col,
  DatePicker,
  Divider,
  Form,
  message,
  notification,
  Row,
  Space,
  Upload,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import db from "@config/firebaseConfig";
import { capitalize, isEmpty } from "lodash";
import ImgCrop from "antd-img-crop";
import { useSelector } from "react-redux";
import {
  getActiveSource,
  getBase64,
  getUpdatedUser,
  uploadPhoto,
  validateImage,
} from "utils/commonFunctions";
import { Header, MenuCtx, Sider } from "@components";
import Card from "@components/UI/Card";
import Text from "@components/UI/Text";
import Button from "@components/UI/Button";
import TextInput from "@components/UI/TextInput";
import { roles } from "@config/staticData";
import moment from "moment";
// import AuthActions from "@redux/reducers/auth/actions";
import useMediaQuery from "utils/useMediaQuery";

// const { setUserData } = AuthActions;

function ProfileEdit() {
  const mc = useContext(MenuCtx);
  // const dispatch = useDispatch();
  const { isXs, isSm } = useMediaQuery();
  const isMobile = isXs || isSm;
  const { userData, token } = useSelector((state) => state.auth);
  const [btnLoading, setBtnLoading] = useState(false);

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [profilePic, setProfilePic] = useState(""); // to be uploaded
  const [picBase64, setPicBase64] = useState(""); // to display preview
  const [selectedRole, setSelectedRole] = useState({}); // to display preview

  useEffect(() => {
    const initialRole = roles.find((r) => r.name === userData.role);
    setSelectedRole(initialRole);
  }, []);

  const handleProfileImage = async (info) => {
    const imageVal = validateImage(info);
    if (imageVal) {
      getBase64(info, (imgUrl) => {
        setPicBase64(imgUrl);
      });
      setProfilePic(info);
    }
  };

  const handleSave = () => {
    form1
      .validateFields()
      .then((v) => submitForm())
      .catch((e) => console.log(e));
    // const e2 = form2
    //   .validateFields()
    //   .then((v) => console.log("V2", v))
    //   .catch((e) => console.log(e));
  };

  const submitForm = async () => {
    setBtnLoading(true);
    const userObject = {
      firstName: form1.getFieldValue("firstName"),
      lastName: form1.getFieldValue("lastName"),
      dob: form1.getFieldValue("dob").format("DD/MM/YYYY"),
      role: selectedRole.name,
    };

    if (!isEmpty(profilePic)) {
      try {
        const res = await uploadPhoto(profilePic, "", "profile_pic");
        setProfilePic(res);
        userObject.profileImage = res;
      } catch (error) {
        message.error(error.message);
        console.error(error);
      }
    }

    db.collection("users")
      .doc(userData.userId)
      .update(userObject)
      .then(() => {
        getUpdatedUser(token);
        notification.success({
          message: "Success",
          description: "Your profile details updated!",
        });
        mc.setActiveMenu(1);
      })
      .catch((e) => {
        message.error(e.message);
        console.error(e);
        setBtnLoading(false);
      });
  };

  const Title = (props) => {
    return (
      <>
        <Card
          round
          className="colFlex allCenter mr-1 mb-2"
          style={{ height: 37, width: 37 }}
        >
          <Text white bold h4>
            {props.n}
          </Text>
        </Card>
        <Text h4 className="mb-2">
          {props.text}
        </Text>
      </>
    );
  };

  const noMobileProps = !isMobile ? { flex: "20", className: "pl-2" } : {};

  const mobileHeaderProps = isMobile
    ? {
        noSearch: true,
        noDrawerBtn: true,
        extraBtn: (
          <ArrowLeftOutlined
            className="headerMenu"
            onClick={() => mc.setActiveMenu(1)}
          />
        ),
      }
    : {};

  return (
    <>
      {!isMobile && (
        <Col flex="4">
          <Sider>
            <Col span={24}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
                onClick={() => mc.setActiveMenu(1)}
              >
                <Text h4>Back</Text>
              </Button>
            </Col>
          </Sider>
        </Col>
      )}
      <Col {...noMobileProps}>
        <Header {...mobileHeaderProps} />
        <div>
          <Row justify="space-between" align="middle" className="mb-2 mt-2">
            <Col>
              <Text h2 className="robotoFamily" weight="500">
                Account
              </Text>
            </Col>
          </Row>
          <Row gutter={[48, 0]} justify="space-between">
            <Col sm={24} md={10}>
              <Space
                direction="vertical"
                style={{ height: "100%", justifyContent: "space-between" }}
              >
                <Row justify="space-between" align="middle">
                  <div className="mr-2">
                    <ImgCrop rotate>
                      <Upload
                        showUploadList={false}
                        beforeUpload={handleProfileImage}
                      >
                        <div className="profileEditImageContainer">
                          <Avatar
                            size={130}
                            src={
                              picBase64 ||
                              userData?.profileImage?.secure_url ||
                              ""
                            }
                            icon={<UserOutlined />}
                            style={{ cursor: "pointer" }}
                          />
                          <Button
                            type="primary"
                            shape="circle"
                            className="editBtnForImg"
                            icon={<EditOutlined />}
                          />
                        </div>
                      </Upload>
                    </ImgCrop>
                  </div>
                  <Col flex="auto">
                    <Row>
                      <Text>{`${userData.firstName} ${userData.lastName}`}</Text>
                    </Row>
                    <Row>
                      <Text light primary>
                        {capitalize(userData.role)}
                      </Text>
                    </Row>
                    <Row>
                      <Divider type="horizontal" className="hr10" />
                    </Row>
                    <Row align="middle">
                      <Text primary bold>
                        {0}
                      </Text>
                      <Text light footnote>
                        &nbsp;Follower&nbsp;
                      </Text>
                      <Text primary bold className="ml-2">
                        {0}
                      </Text>
                      <Text light footnote>
                        &nbsp;&nbsp;Following&nbsp;
                      </Text>
                    </Row>
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={24}>
                    <Row align="middle" className={isMobile && "mt-2"}>
                      <Title n={1} text="Profile information" />
                    </Row>
                    <Row align="middle">
                      <Form form={form1} labelCol={0} wrapperCol={24}>
                        <Space direction="vertical" style={{ width: "380px" }}>
                          <Form.Item
                            initialValue={userData.firstName}
                            name="firstName"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your name.",
                              },
                            ]}
                          >
                            <TextInput placeholder="Name" defaultValue />
                          </Form.Item>
                          <Form.Item
                            initialValue={userData.lastName}
                            name="lastName"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your surname.",
                              },
                            ]}
                          >
                            <TextInput placeholder="Surname" />
                          </Form.Item>
                          <Form.Item
                            initialValue={moment(userData.dob, "DD/MM/YYYY")}
                            name="dob"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your date of birth.",
                              },
                            ]}
                          >
                            <DatePicker
                              allowClear={false}
                              inputReadOnly
                              placeholder="Enter your date of birth"
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                        </Space>
                      </Form>
                    </Row>
                  </Col>
                </Row>
              </Space>
            </Col>
            <Col sm={24} md={14}>
              <Row align="middle" className={isMobile && "mt-2"}>
                <Title n={2} text="Role" />
              </Row>
              <Row className="mb-4" align="middle">
                <Row
                  justify={isMobile ? "space-around" : "center"}
                  align="middle"
                  gutter={[16, 48]}
                >
                  {roles.map((item) => {
                    const isActive = selectedRole?.id === item.id;
                    return (
                      <Col sm={12} md={6} className="textCenter" key={item.id}>
                        <div
                          className="roleButton3 colFlex allCenter"
                          onClick={() => setSelectedRole(item)}
                        >
                          {/* <span
                            className={`roleName2 ${
                              isActive && "primaryColor"
                            }`}
                            style={
                              item.id === 4 ? { margin: "0px !important" } : {}
                            }
                          >
                            {item.name}
                          </span> */}
                          <Text
                            primary={isActive}
                            secondary={!isActive}
                            className={item.id !== 4 && !isMobile ? "mb-1" : ""}
                            style={
                              item.id === 4 && isMobile
                                ? { marginLeft: 30 }
                                : {}
                            }
                          >
                            {capitalize(item.name)}
                          </Text>
                          <img
                            style={
                              item.id == 4 && !isMobile
                                ? { height: 145, width: 165, marginTop: 8 }
                                : item.id == 4 && isMobile
                                ? { marginRight: -20 }
                                : {}
                            }
                            className="roleImg2"
                            src={getActiveSource(item.icon, isActive)}
                          />
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Row>
              <Row align="middle">
                <Title n={3} text="Account information" />
              </Row>
              <Row align="middle">
                <Form form={form2} labelCol={0} wrapperCol={24}>
                  <Space direction="vertical" style={{ width: "380px" }}>
                    <Form.Item
                      initialValue={userData.email}
                      name="email"
                      rules={[
                        { required: true, message: "Email is required!" },
                        {
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]}
                    >
                      <TextInput placeholder="Enter your email" disabled />
                    </Form.Item>
                    <Form.Item
                      initialValue="Aaaaaa"
                      name="password"
                      rules={[
                        { required: true, message: "Password is required!" },
                      ]}
                    >
                      <TextInput
                        disabled
                        passwordType
                        placeholder="Enter your password"
                      />
                    </Form.Item>
                  </Space>
                </Form>
              </Row>
            </Col>
          </Row>
          <Row justify="end">
            <span className="mt-2 mb-2">
              <Button type="primary" loading={btnLoading} onClick={handleSave}>
                SAVE
              </Button>
            </span>
          </Row>
        </div>
      </Col>
    </>
  );
}

export default ProfileEdit;
