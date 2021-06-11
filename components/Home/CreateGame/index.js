import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Avatar,
  Col,
  DatePicker,
  message,
  notification,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Upload,
} from "antd";
import { Header, MenuCtx, Sider } from "@components";
import Text from "@components/UI/Text";
import {
  FootballIcon,
  GalleryIcon,
  InfoCircleIcon,
  KickBallIcon,
  LockedIcon,
  MoneyIcon,
  PeoplesIcon,
  PitchIcon,
  PlaceIcon,
  SettingsIcon,
  TeamAIcon,
  TeamBIcon,
  TShirtIcon,
  UnLockedIcon,
} from "@components/UI/Icons";
import Card from "@components/UI/Card";
import { capitalize, has, isEmpty, isEqual } from "lodash";
import {
  getBase64,
  theme,
  uploadPhoto,
  validateImage,
} from "utils/commonFunctions";
import TextInput from "@components/UI/TextInput";
import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import Dropdown from "@components/UI/Dropdown";
import Button from "@components/UI/Button";
import ImgCrop from "antd-img-crop";
import SportCenterModal from "./SportCenterModal";
import {
  cancellationDuration,
  paymentTypes,
  pitchTypes,
} from "@config/staticData";
import db from "@config/firebaseConfig";
import CongratsModal from "./CongratsModal";
import useMediaQuery from "utils/useMediaQuery";
const { Option } = Select;
const { Step } = Steps;

function CreateGame(props) {
  const mc = useContext(MenuCtx);
  const router = useRouter();

  const { isXs, isSm } = useMediaQuery();
  const isMobile = isSm || isXs;

  const { userData } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showCentersModal, setShowCentersModal] = useState(false);
  const [showCongratsModal, setCongratsModal] = useState(false);

  const [pitch, setPitch] = useState("");
  const [center, setCenter] = useState({});
  const [payment, setPayment] = useState(paymentTypes[0]);
  const [cost, setCost] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [participants, setParticipants] = useState({});
  const [cancellationTerms, setCancellationTerms] = useState(
    cancellationDuration[0]
  );
  const [isCoverdPitch, setIsCoverdPitch] = useState(false);
  // const [teamA, setTeamA] = useState();
  // const [teamB, setTeamB] = useState();
  const [gamePic, setGamePic] = useState({}); // to be uploaded when updated success! store the object in same state.

  const [picBase64, setPicBase64] = useState(""); // to display preview

  const handleProfileImage = async (info) => {
    const imageVal = validateImage(info);
    if (imageVal) {
      getBase64(info, (imgUrl) => {
        setPicBase64(imgUrl);
      });
      setGamePic(info);
      try {
        const res = await uploadPhoto(info, Date.now(), "game_pic");
        setGamePic(res);
      } catch (error) {
        message.error(error.message);
        console.error(error);
      }
    }
  };

  const handleContinue = () => {
    if (validateOne()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const validateOne = () => {
    if (isEmpty(pitch)) {
      message.error("Please select type of pitch!");
      return false;
    }
    if (isEmpty(center)) {
      message.error("Please select a sports center!");
      return false;
    }
    if (isEmpty(cost)) {
      message.error("Please enter cost per person for game!");
      return false;
    }
    if (isEmpty(gameDate) || isEmpty(gameDate.string)) {
      message.error("Please select date and time!");
      return false;
    }
    if (isEmpty(participants)) {
      message.error("Please select participants type!");
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    const gameObj = {
      pitch,
      center,
      payment,
      cost,
      dateTime: gameDate.string,
      isPrivate: participants === "private" || false,
      isCoverdPitch,
      managerId: userData.userId,
      teams: {
        teamA: {},
        teamB: {},
      },
    };

    if (has(gamePic, "asset_id")) {
      gameObj.image = gamePic;
    }

    if (btnLoading) return;
    setBtnLoading(true);
    try {
      let result = await db.collection("games").add(gameObj);
      if (result.id) {
        setCongratsModal(true);
      }
      setBtnLoading(false);
    } catch (error) {
      console.log("Error adding document: ", error);
      notification.error({
        message: "Oops!",
        description: "something went wrong while creating your game",
      });
      setBtnLoading(false);
    }
  };

  const handleBack = () => {
    console.log("Onclick handleBack");
    if (currentStep === 0) {
      //Close Create Game
    } else if ([1, 2].includes(currentStep)) {
      setCurrentStep(currentStep - 1);
    }
  };

  //! ------------------ RENDERS ---------------------!
  const renderFirstStep = () => {
    return (
      <>
        {isMobile ? (
          <Row align="middle" className="mb-1">
            <Text h3 className="robotoFamily mb-1" weight="500">
              Create Game
            </Text>
          </Row>
        ) : null}
        <Row align="middle" className={`${!isMobile && "mt-4"} mb-1`}>
          <PitchIcon className="formLabelIcon" />
          <Text h4>Type Pitch</Text>
        </Row>
        <Row gutter={isMobile ? 6 : 24}>
          {pitchTypes.map((p) => {
            return (
              <Col key={p.id}>
                <Card
                  trans={!isEqual(pitch.id, p.id)}
                  className={`pitchCard ${
                    isEqual(pitch.id, p.id) && "pitchCard-active"
                  }`}
                  onClick={() => setPitch(p)}
                >
                  <Text
                    h4
                    bold
                    primary={!isEqual(pitch.id, p.id)}
                    white={isEqual(pitch.id, p.id)}
                  >
                    {p.label}
                  </Text>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Row
          align="middle"
          className="mt-2 mb-1"
          style={{ wordBreak: "break-all" }}
        >
          <PlaceIcon className="formLabelIcon" />
          <Text h4>Sports Center</Text>
        </Row>
        <Row gutter={[48, 24]}>
          <Col
            xs={24}
            sm={24}
            md={10}
            onClick={() => setShowCentersModal(true)}
            className="pointer"
          >
            <TextInput
              placeholder="Search Sports Center"
              value={center.Name || undefined}
              suffix={<SearchOutlined />}
              disabled={true}
              className="pointer"
            />
          </Col>
          <Col xs={24} sm={24} md={10}>
            <Dropdown
              placeholder="Payment"
              value={payment?.value || undefined}
              onChange={(p) => setPayment(p)}
            >
              {paymentTypes.map((p) => {
                return (
                  <Option key={p.id} value={p.value}>
                    {p.label}
                  </Option>
                );
              })}
            </Dropdown>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <TextInput
              type="number"
              placeholder="Cost per person"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              prefix={
                <Text primary style={{ fontSize: 16 }}>
                  &pound;
                </Text>
              }
            />
          </Col>
          <Col xs={24} sm={24} md={10}>
            <DatePicker
              inputReadOnly
              format="MM-DD-YYYY HH:mm"
              allowClear={false}
              showTime={{ format: "HH:mm" }}
              value={gameDate.moment}
              onChange={(m, s) => setGameDate({ moment: m, string: s })}
            />
          </Col>
        </Row>
        <Row align="middle" className="mt-2 mb-1">
          <SettingsIcon className="formLabelIcon" />
          <Text h4>Advance Options</Text>
        </Row>
        <Row gutter={[48, 24]}>
          <Col xs={24} sm={24} md={10}>
            <Dropdown
              placeholder="Cancellation terms"
              value={cancellationTerms?.value || undefined}
              onChange={(v) => setCancellationTerms(v)}
            >
              {cancellationDuration.map((c) => {
                return (
                  <Option key={c.id} value={c.value}>
                    {c.label}
                  </Option>
                );
              })}
            </Dropdown>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <Row
              justify="space-between"
              align="middle"
              style={{ height: "100%" }}
            >
              <Text>Covered Pitch</Text>
              <div>
                <Switch
                  checked={isCoverdPitch}
                  onChange={(v, e) => setIsCoverdPitch(v)}
                />
              </div>
            </Row>
          </Col>
        </Row>
        <Row align="middle" className="mt-2 mb-1">
          <PeoplesIcon className="formLabelIcon" />
          <Text h4>Participants</Text>
        </Row>
        <Row gutter={24}>
          {["private", "public"].map((p) => {
            return (
              <Col key={p}>
                <Card
                  trans={participants !== p}
                  className={`pitchCard ${
                    participants === p && "pitchCard-active"
                  }`}
                  style={{
                    color:
                      participants === p
                        ? theme.colors.white
                        : theme.colors.primary,
                  }}
                  onClick={() => setParticipants(p)}
                >
                  {p === "public" ? (
                    <UnLockedIcon className="privacyIcons" />
                  ) : (
                    <LockedIcon className="privacyIcons" />
                  )}
                  <Text
                    h4
                    bold
                    primary={participants !== p}
                    white={participants == p}
                  >
                    {capitalize(p)}
                  </Text>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Row>
          <Text footnote className="mt-1">
            {participants === "private" &&
              "*Only People you decide to invite can participate."}
            {participants === "public" &&
              " *Anyone can request to participate."}
          </Text>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={20}>
            <Row justify={isMobile ? "center" : "end"}>
              <span className="mt-1 mb-2">
                <Button type="primary" onClick={handleContinue}>
                  CONTINUE
                </Button>
              </span>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  // const renderSecondStep = () => {
  //   return (
  //     <>
  //       <Row align="middle">
  //         <div className="mt-4 mb-1">
  //           <TShirtIcon className="formLabelIcon" />
  //           <Text h4>Select Teams</Text>
  //         </div>
  //       </Row>
  //       <Row justify="start" align="bottom">
  //         <Col span={20}>
  //           <Row justify="center" align="middle">
  //             <Col span={11}>
  //               <Row justify="center" align="middle">
  //                 <TeamAIcon className="teamLogos" />
  //               </Row>
  //             </Col>
  //             <Col span={2}>
  //               <Row justify="center" align="middle">
  //                 <Text h2>VS</Text>
  //               </Row>
  //             </Col>
  //             <Col span={11}>
  //               <Row justify="center" align="middle">
  //                 <TeamBIcon className="teamLogos" />
  //               </Row>
  //             </Col>
  //           </Row>
  //         </Col>
  //       </Row>
  //       <Row justify="start">
  //         <Col span={20}>
  //           <Row justify="center" align="middle">
  //             <Col span={11}>
  //               <Row justify="center" align="middle">
  //                 <TextInput
  //                   placeholder="Team A"
  //                   value={teamA}
  //                   onChange={(e) => setTeamA(e.target.value)}
  //                   className="teamNameInput ml-1 mr-1"
  //                 />
  //               </Row>
  //             </Col>
  //             <Col span={11} offset={2}>
  //               <Row justify="center" align="middle">
  //                 <TextInput
  //                   placeholder="Team B"
  //                   value={teamB}
  //                   onChange={(e) => setTeamB(e.target.value)}
  //                   className="teamNameInput ml-1 mr-1"
  //                 />
  //               </Row>
  //             </Col>
  //           </Row>
  //         </Col>
  //       </Row>
  //       <Row>
  //         <Col span={20}>
  //           <Row justify="end" className="mt-2 mb-4">
  //             <Button type="text" className="mr-1" onClick={handleBack}>
  //               BACK
  //             </Button>
  //             <Button type="primary" onClick={handleContinue}>
  //               CONTINUE
  //             </Button>
  //           </Row>
  //         </Col>
  //       </Row>
  //     </>
  //   );
  // };

  const renderThirdStep = () => {
    return (
      <>
        <Row align="top" style={{ marginTop: !isMobile ? "6rem" : "1rem" }}>
          <Col xs={24} sm={24} md={10}>
            <div className={!isMobile ? "rightBorder" : ""}>
              <Row
                justify={isMobile ? "start" : "center"}
                align="middle"
                className="mb-1"
              >
                <GalleryIcon className="formLabelIcon" />
                <Text h4>Cover Image</Text>
              </Row>
              <Row justify="center">
                <Col>
                  <ImgCrop rotate>
                    <Upload
                      showUploadList={false}
                      beforeUpload={handleProfileImage}
                    >
                      <div className="gameAvatar mt-2">
                        <Avatar
                          shape="square"
                          className="gameAvatar"
                          size={140}
                          src={picBase64}
                          icon={<KickBallIcon />}
                          style={{ cursor: "pointer" }}
                        />
                        <a className="uploadText mt-1 mb-2">Change Image</a>
                      </div>
                    </Upload>
                  </ImgCrop>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} sm={24} md={14}>
            <Row justify={isMobile ? "start" : "center"} align="middle">
              <Col xs={24} sm={24} md={12}>
                <Row className={!isMobile ? "mb-1" : ""} align="middle">
                  <InfoCircleIcon className="formLabelIcon" />
                  <Text h4>Recap information</Text>
                </Row>
              </Col>
            </Row>
            <Row justify="center">
              <Col xs={24} sm={24} md={14}>
                <div className="mt-2">
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                  >
                    <Row align="middle">
                      <Col span={2}>
                        <FootballIcon className="formLabelIcon primaryColor" />
                      </Col>
                      <Col span={20} offset={1}>
                        <Text>{pitch.label || "-"}</Text>
                      </Col>
                    </Row>
                    <Row align="top">
                      <Col span={2}>
                        <PlaceIcon className="formLabelIcon primaryColor" />
                      </Col>
                      <Col span={20} offset={1}>
                        <Row>
                          <Text>{center.Name || "-"}</Text>
                        </Row>
                        <Row>
                          <Text style={{ fontWeight: "400 !important" }}>
                            {center.Address || "-"}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={2}>
                        <CalendarOutlined
                          style={{ fontSize: 20 }}
                          className="formLabelIcon primaryColor"
                        />
                      </Col>
                      <Col span={20} offset={1}>
                        <Text>{gameDate.string}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={2}>
                        <MoneyIcon className="formLabelIcon primaryColor" />
                      </Col>
                      <Col span={20} offset={1}>
                        <Text>{cost} £ per person</Text>
                      </Col>
                    </Row>
                  </Space>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify="end" align="bottom" className="mt-3 mb-4">
          <Button type="text" className="mr-1" onClick={handleBack}>
            BACK
          </Button>
          <Button type="primary" loading={btnLoading} onClick={handlePublish}>
            PUBLISH
          </Button>
        </Row>
      </>
    );
  };

  const noMobProps = isMobile ? {} : { flex: "20", className: "pl-2" };

  return (
    <>
      {!isMobile && (
        <Col flex="4">
          <Sider
            bottomFix={
              <Button type="text" onClick={() => mc.setActiveMenu(1)}>
                CANCEL
              </Button>
            }
          >
            <Col span={24}>
              <Text h3 className="robotoFamily mb-2" weight="500">
                Create Game
              </Text>
              <Col>
                <div className="mt-2 stepsCounter">
                  <Steps direction="vertical" current={currentStep}>
                    <Step title="Game information" />
                    {/* <Step title="In Progress" /> */}
                    <Step title="Recap & Publish" />
                  </Steps>
                </div>
              </Col>
            </Col>
          </Sider>
        </Col>
      )}
      <Col {...noMobProps}>
        <Header />
        {currentStep === 0 && renderFirstStep()}
        {currentStep === 1 && renderThirdStep()}
        {/* {currentStep === 2 && renderThirdStep()} */}
      </Col>
      <SportCenterModal
        visible={showCentersModal}
        dismiss={(v) => {
          setShowCentersModal(false);
          if (!isEmpty(v)) {
            setCenter(v);
          }
        }}
      />
      <CongratsModal
        visible={showCongratsModal}
        dismiss={() => {
          router.push("/matches");
          setCongratsModal(false);
        }}
      />
    </>
  );
}

export default CreateGame;
