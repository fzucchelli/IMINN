/* eslint-disable react/prop-types */
import React, { useMemo, useState } from "react";
import firebase from "firebase";
import { useRouter } from "next/router";
import Text from "@components/UI/Text";
import Button from "@components/UI/Button";
import { Header, Sider } from "@components";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  MessageOutlined,
  MinusOutlined,
  PlusOutlined,
  SendOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import db from "@config/firebaseConfig";
import {
  Avatar,
  Badge,
  Col,
  Divider,
  Dropdown,
  Empty,
  Menu,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Tag,
} from "antd";
import { useDocument } from "react-firebase-hooks/firestore";
import { capitalize, has, isArray, isEmpty, map } from "lodash";
import { useSelector } from "react-redux";
import Images from "@config/images";
import {
  DropArrow,
  MoneyIcon,
  PitchIcon,
  PlaceIcon,
  TeamAIcon,
  TeamBIcon,
} from "@components/UI/Icons";
import "./styles.module.less";
import { getInitials, theme } from "utils/commonFunctions";
import Card from "@components/UI/Card";
import { shareMsg } from "@config/staticData";
import siteConfig from "@config/siteConfig";
import TextInput from "@components/UI/TextInput";
import useMediaQuery from "utils/useMediaQuery";
import moment from "moment";

function GameDetails() {
  const router = useRouter();
  const { userData } = useSelector((state) => state.auth);

  // const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [showSquadModal, setShowSquadModal] = useState(false);
  // const [showSelectTeamModal, setShowSelectTeamModal] = useState(false);
  const { isXs, isSm } = useMediaQuery();

  const leftSpan = isXs || isSm ? 24 : 13;
  const rightSpan = isXs || isSm ? 24 : 24 - leftSpan - 2;

  const [openManagerNote, setOpenManagerNote] = useState(false);

  const [myTeam, setMyTeam] = useState(null);

  const [btnLoadingA, setBtnLoadingA] = useState(false);
  const [btnLoadingB, setBtnLoadingB] = useState(false);
  const [finalLoader, setFinalLoader] = useState(true);
  const [manager, setManager] = useState({});
  const [following, setFollowing] = useState(false);
  const [openChatInput, setOpenChatInput] = useState(true);
  const [cInp, setCInp] = useState("");
  const [mNote, setMNote] = useState("");

  const [msgSending, setMsgSending] = useState(false);
  const [managerNoteLoader, setManagerNoteLoader] = useState(false);

  const [mbDropdown, setMbDropDown] = useState(false); //Mobile Only
  const [chatView, setChatView] = useState(false); //Mobile Only

  const [messageList, setMessageList] = useState([]);

  const [value, loading] = useDocument(
    db.doc(`games/${router?.query.matches[0]}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const handleLoader = (type = "A", action) => {
    if (type == "A") {
      setBtnLoadingA(action);
    } else {
      setBtnLoadingB(action);
    }
  };

  const joinTeam = (team) => {
    if (isEmpty(userData)) {
      router.push("/signin");
      return;
    }
    const playerData = {
      playerId: userData.userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.profileImage.secure_url || "",
      role: userData.role,
      email: userData.email,
    };
    handleLoader(team, true);
    db.collection("games")
      .doc(`${router?.query.matches[0]}`)
      .update({
        [`teams.team${team}`]:
          firebase.firestore.FieldValue.arrayUnion(playerData),
      })
      .then(() => {
        console.log("Document successfully written!");
        handleLoader(team, false);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
        handleLoader(team, false);
      });
  };

  const unJoinTeam = (team) => {
    const playerData = {
      playerId: userData.userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.profileImage.secure_url,
      role: userData.role,
      email: userData.email,
    };
    handleLoader(team, true);
    db.collection("games")
      .doc(`${router?.query.matches[0]}`)
      .update({
        [`teams.team${team}`]:
          firebase.firestore.FieldValue.arrayRemove(playerData),
      })
      .then(() => {
        console.log(`Team ${team} Unjoined successfully!`);
        handleLoader(team, false);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
        handleLoader(team, false);
      });
  };

  const data = useMemo(() => {
    if (value && value.exists) {
      if (isEmpty(manager)) {
        db.collection("users")
          .doc(value.data().managerId)
          .get()
          .then((d) => {
            if (d.exists) {
              setManager(d.data());
              setFinalLoader(false);
            }
          })
          .catch((e) => console.log(e));
      }
      let myTeam;
      map(value.data().teams.teamA, (v) => {
        if (v.playerId === userData.userId) {
          myTeam = "A";
        }
      });
      map(value.data().teams.teamB, (v) => {
        if (v.playerId === userData.userId) {
          myTeam = "B";
        }
      });
      if (myTeam) {
        setMyTeam(myTeam);
      } else {
        setMyTeam(null);
      }
      if (
        has(value.data(), "followers") &&
        value.data().followers?.includes(userData.userId)
      ) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
      if (has(value.data(), "messages")) {
        setMessageList(value.data().messages.reverse());
      }
      if (has(value.data(), "managerNote")) {
        setMNote(value.data().managerNote);
      }
      console.log("%cALL DATA", "color:blue", value.data());
      return value.data();
    }
  }, [value]);

  const noticeAccess = useMemo(() => {
    //If person is a manager or person's is a part of any team can send message
    if (data && data.managerId === userData.userId) {
      return true;
    }
    if (myTeam !== null) {
      return true;
    }
    return false;
  }, [data, myTeam, userData]);

  const messageBoxHeight = useMemo(() => {
    if (isXs || isSm) {
      return noticeAccess ? 180 : 120;
    }
    return noticeAccess ? 480 : 420;
  }, [noticeAccess]);

  // const handleFollow = () => {
  //   if (isEmpty(userData)) {
  //     message.info("You must be signed in to use this feature!");
  //     return;
  //   }
  //   const operationType = !following ? "arrayUnion" : "arrayRemove";
  //   db.collection("games")
  //     .doc(`${router?.query.matches[0]}`)
  //     .update({
  //       followers: firebase.firestore.FieldValue[operationType](
  //         userData.userId
  //       ),
  //     })
  //     .then((d) => console.log("Follow/Unfollow Success", d))
  //     .catch((e) => console.log(e));
  // };

  const toggleExpand = () => setMbDropDown(!mbDropdown);

  const handleShare = ({ key }) => {
    if (!value.exists) {
      return;
    }
    let url = "";
    const postUrl = `http://${siteConfig.domainUrl}/matches/${value.id}`;
    if (key == 1) {
      url = `https://www.facebook.com/sharer.php?u=${postUrl}`;
    }
    if (key == 2) {
      url = `https://twitter.com/share?url=${postUrl}&text=${shareMsg}`;
    }
    if (key == 3) {
      url = `https://api.whatsapp.com/send?text=${shareMsg} ${postUrl}`;
    }
    console.log("===> ~ handleShare ~ url", key, url);

    window && window.open(url, "_blank");
  };

  const copyLink = () => {
    const postUrl = `http://${siteConfig.domainUrl}/matches/${value.id}`;

    navigator.clipboard.writeText(postUrl);
    message.info("Match link Copied!");
  };

  const handleSend = () => {
    if (msgSending) return;
    const msg = cInp.trim();
    const msgData = {
      time: moment().format(),
      text: msg,
      senderId: userData.userId,
    };
    setMsgSending(true);
    setCInp("");
    db.collection("games")
      .doc(`${router?.query.matches[0]}`)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion(msgData),
      })
      .then(() => {
        setMsgSending(false);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
        setMsgSending(false);
      });
  };

  const handleManagersNote = () => {
    setManagerNoteLoader(true);
    db.collection("games")
      .doc(`${router?.query.matches[0]}`)
      .update({
        managerNote: mNote.trim() || "",
      })
      .then(() => {
        setManagerNoteLoader(false);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
        setManagerNoteLoader(false);
      });
  };

  const renderShareLinks = () => (
    <Menu onClick={handleShare}>
      <Menu.Item
        key="1"
        icon={
          <img
            className="mr-1"
            src={Images.fbShare}
            height="26px"
            width="26px"
            alt="socialLink"
          />
        }
      >
        <Text black>Via Facebook</Text>
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={
          <img
            className="mr-1"
            src={Images.twitterShare}
            height="26px"
            width="26px"
            alt="socialLink"
          />
        }
      >
        <Text black>Via Twitter</Text>
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={
          <img
            className="mr-1"
            src={Images.whatsappShare}
            height="26px"
            width="26px"
            alt="socialLink"
          />
        }
      >
        <Text black>Via Whatsapp</Text>
      </Menu.Item>
    </Menu>
  );

  const renderTeam = (name) => {
    const { teams } = value ? value.data() : [];
    let listRender = [];
    if (name == "A" && !isEmpty(teams.teamA) && isArray(teams.teamA)) {
      listRender = teams.teamA.map((p, index) => {
        return (
          <Row
            justify="center"
            align="middle"
            key={index}
            className={`mt-1 ${!isMobile && "pl-2"}`}
          >
            <Col flex="60px">
              <Badge count={0} overflowCount={999} offset={[-5, 3]}>
                <Avatar size={44} src={p.avatar || ""} className="primaryBg">
                  {getInitials(p)}
                </Avatar>
              </Badge>
            </Col>
            <Col flex="auto">
              <Row>
                <Text bold small clamp={1}>
                  {`${p.firstName} ${p.lastName}`}
                </Text>
              </Row>
              <Row>
                <Text primary light small>
                  {capitalize(p.role)}
                </Text>
              </Row>
            </Col>
          </Row>
        );
      });
    }
    if (name == "B" && !isEmpty(teams.teamB) && isArray(teams.teamB)) {
      listRender = teams.teamB.map((p, index) => {
        return (
          <Row
            align="middle"
            key={index}
            className={`mt-1 ${!isMobile && "pl-2"}`}
          >
            <Col flex="60px">
              <Badge count={0} overflowCount={999} offset={[-5, 3]}>
                <Avatar size={44} src={p.avatar || ""} className="primaryBg">
                  {getInitials(p)}
                </Avatar>
              </Badge>
            </Col>
            <Col flex="auto">
              <Row>
                <Text bold small clamp={1}>
                  {`${p.firstName} ${p.lastName}`}
                </Text>
              </Row>
              <Row>
                <Text primary light small>
                  {capitalize(p.role)}
                </Text>
              </Row>
            </Col>
          </Row>
        );
      });
    }

    listRender.push(
      <Row justify="center" align="middle">
        <Button
          className="mt-1"
          type="primary"
          disabled={
            (myTeam === "A" && name === "B") || (myTeam === "B" && name === "A")
          }
          // loading={name === "A" ? btnLoadingA : btnLoadingB}
          onClick={() =>
            !(name === "A" ? btnLoadingA : btnLoadingB)
              ? myTeam == name
                ? unJoinTeam(name)
                : joinTeam(name)
              : null
          }
        >
          {myTeam == name ? "UNJOIN" : "JOIN"}
        </Button>
      </Row>
    );

    return listRender;
  };

  const renderMessages = () => {
    let allMembers = [manager];
    if (data && data.teams && isArray(data.teams.teamA)) {
      allMembers = [...allMembers, ...data.teams.teamA];
    }
    if (data && data.teams && isArray(data.teams.teamB)) {
      allMembers = [...allMembers, ...data.teams.teamB];
    }
    return (
      <>
        {openChatInput && noticeAccess && (
          <Row className="w100 pl-1 pr-1 mb-1">
            <Col flex="auto">
              <TextInput
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                value={cInp}
                onChange={(e) => setCInp(e.target.value)}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 1 }}
              />
            </Col>
            <Col>
              <Button
                onClick={() => handleSend()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                  borderRadius: 10,
                  height: 37,
                }}
                type="primary"
                shape="square"
                icon={<SendOutlined style={{ fontSize: 18 }} />}
              />
            </Col>
          </Row>
        )}
        <Space
          direction="vertical"
          className="w100 messageBox pl-1 pr-1"
          style={{
            maxHeight: `calc(100vh - ${messageBoxHeight}px)`,
          }}
          split={
            <Divider
              type="horizontal"
              style={{ margin: "8px 5px", width: "80%" }}
            />
          }
        >
          {isEmpty(messageList) && (
            <Row justify="center" align="middle">
              <Text secondary>No notices yet!</Text>
            </Row>
          )}
          {messageList.map((m, k) => {
            let sender = allMembers.find((p) => m.senderId === p.playerId);
            if (!sender) return;
            let avatarSrc;
            if (m.senderId === data?.managerId) {
              avatarSrc = manager && manager.profileImage.secure_url;
            } else {
              avatarSrc = sender.avatar;
            }
            return (
              <Row justify="center" align="middle" key={k} wrap={false}>
                <Col flex="60px">
                  <Badge count={0} overflowCount={999} offset={[-5, 3]}>
                    <Avatar
                      size={44}
                      src={avatarSrc || ""}
                      className="primaryBg"
                    >
                      {getInitials(sender)}
                    </Avatar>
                  </Badge>
                </Col>
                <Col flex="auto">
                  <Row justify="space-between">
                    <Col>
                      <Text bold small clamp={1}>
                        {`${sender.firstName} ${sender.lastName}`}
                      </Text>
                    </Col>
                    <Col>
                      <Text footnote light secondary>
                        {moment(m.time).fromNow(true)}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Text light small clamp={10}>
                      {m.text}
                    </Text>
                  </Row>
                </Col>
              </Row>
            );
          })}
        </Space>
      </>
    );
  };

  const renderManagerNoteModal = () => {
    return (
      <Modal
        visible={openManagerNote}
        onCancel={() => {
          setOpenManagerNote(false);
          setMNote("");
        }}
        centered
        footer={null}
        width="400px"
      >
        <Row>
          <Col span={24} className="colFlex">
            <Row>
              <Text h4 black bold className="mb-1">
                Note for players
              </Text>
            </Row>
            <Row>
              <TextInput
                inModal
                textAreaType
                autofocus
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                value={mNote}
                onChange={(e) => setMNote(e.target.value)}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
            </Row>
            <Row justify="end" className="mt-2">
              <Button
                className="primaryColor mr-1"
                inModal
                type="text"
                onClick={() => {
                  setOpenManagerNote(false);
                }}
              >
                CANCEL
              </Button>
              <Button
                loading={managerNoteLoader}
                disabled={managerNoteLoader}
                type="primary"
                onClick={() => {
                  setOpenManagerNote(false);
                  handleManagersNote();
                }}
              >
                OK
              </Button>
            </Row>
          </Col>
        </Row>
      </Modal>
    );
  };

  const renderNoticeBoard = () => {
    return (
      <Row align="middle" className="p-1">
        <Col flex="32px">
          <MessageOutlined
            style={{ fontSize: 28 }}
            className="primaryColor mr-1"
          />
        </Col>
        <Col flex="auto">
          <Text h3 className="bold" weight="500">
            Notice Board
          </Text>
        </Col>
        <Col flex="35px">
          <Card
            onClick={() => {
              setChatView(false);
              setOpenChatInput(!openChatInput);
            }}
            round
            style={{ height: 30, width: 30 }}
            className="colFlex allCenter pointer"
          >
            {!openChatInput ? (
              <PlusOutlined style={{ fontSize: 18 }} className="whiteColor" />
            ) : (
              <MinusOutlined style={{ fontSize: 18 }} className="whiteColor" />
            )}
          </Card>
        </Col>
      </Row>
    );
  };

  const renderFloatingBtn = () => {
    if (!isMobile) {
      return <></>;
    }
    return (
      <Card
        onClick={() => setChatView(true)}
        round
        style={{ height: 55, width: 55 }}
        className="colFlex allCenter pointer floatingBtn"
      >
        <MessageOutlined style={{ fontSize: 28 }} className="whiteColor" />
      </Card>
    );
  };

  let totalA = 0;
  let totalB = 0;

  const noMobileProps = !(isSm || isXs)
    ? { flex: "20", className: "pl-2" }
    : {};

  const isMobile = isSm || isXs;

  if (chatView) {
    return (
      <Card trans className="noSelect mt-1 w100">
        {renderNoticeBoard()}
        {openChatInput ? renderMessages() : null}
      </Card>
    );
  }

  return (
    <>
      {isSm || isXs ? null : (
        <Col flex="4">
          <Sider>
            <Col span={24}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
                onClick={() => router.back()}
              >
                <Text h4>Back</Text>
              </Button>
            </Col>
          </Sider>
        </Col>
      )}
      <Col {...noMobileProps}>
        {isMobile ? (
          <Header
            noSearch={true}
            noDrawerBtn={true}
            extraBtn={
              <ArrowLeftOutlined
                className="headerMenu"
                onClick={() => router.back()}
              />
            }
          />
        ) : (
          <Header noSearch={true} />
        )}
        {loading || finalLoader ? (
          <Row justify="center" align="middle" style={{ height: "50vh" }}>
            <Spin spinning size="large" />
          </Row>
        ) : value.exists ? (
          <div className="minHeight">
            <Row align="middle" className="mt-2">
              <Col>
                <Row align="middle">
                  <PitchIcon className="primaryColor mr-1" />
                </Row>
              </Col>
              <Col>
                <Text h3 className="bold" weight="500">
                  {data.pitch.label}
                </Text>
              </Col>
              {isMobile && (
                <Col flex="auto" onClick={() => toggleExpand()}>
                  <Row className="w100" justify="end">
                    <DropArrow className="primaryColor" />
                  </Row>
                </Col>
              )}
            </Row>
            <Row
              justify="space-between"
              style={mbDropdown ? { display: "none" } : {}}
            >
              <Col span={leftSpan}>
                <Space direction="vertical" className="mt-2">
                  <Row align="top" wrap={false}>
                    <Col style={{ width: 36 }}>
                      <PlaceIcon className="formLabelIcon primaryColor mr-1" />
                    </Col>
                    <Col>
                      <Row>
                        <Text>{data.center.Name || "-"}</Text>
                      </Row>
                      <Row>
                        <Text style={{ fontWeight: "400 !important" }}>
                          {data.center.Address || "-"}
                        </Text>
                      </Row>
                    </Col>
                  </Row>
                  <Row align="middle" wrap={false}>
                    <Col style={{ width: 36 }}>
                      <CalendarOutlined
                        style={{ fontSize: 20 }}
                        className="formLabelIcon primaryColor mr-1"
                      />
                    </Col>
                    <Col>
                      <Text>{data.dateTime}</Text>
                    </Col>
                  </Row>
                  <Row align="middle" wrap={false}>
                    <Col style={{ width: 36 }}>
                      <MoneyIcon className="formLabelIcon primaryColor mr-1" />
                    </Col>
                    <Col>
                      <Text>{data.cost} £ per person</Text>
                    </Col>
                  </Row>
                </Space>
              </Col>
              <Col span={rightSpan}>
                <Row align="middle" wrap={false} className="mt-2">
                  <Col>
                    <Avatar
                      className="primaryBg mr-2"
                      size={65}
                      icon={<UserOutlined />}
                      src={(manager && manager?.profileImage?.secure_url) || ""}
                    >
                      {getInitials(manager)}
                    </Avatar>
                  </Col>
                  <Col flex="auto" className="w100">
                    <Space direction="vertical" className="w100">
                      <Row align="middle" justify="space-between" wrap={false}>
                        <Col>
                          <Text
                            bold
                            h4
                            clamp={1}
                          >{`${manager.firstName} ${manager.lastName}`}</Text>
                        </Col>
                        <Col>
                          <Tag color={theme.colors.primary}>Manager</Tag>
                        </Col>
                      </Row>
                      {data.managerId === userData.userId && (
                        <Row align="middle">
                          {!data.managerNote ? (
                            <a onClick={() => setOpenManagerNote(true)}>
                              Add a message for teams!
                            </a>
                          ) : (
                            <a onClick={() => setOpenManagerNote(true)}>
                              {data?.managerNote}
                            </a>
                          )}
                        </Row>
                      )}
                      {data.managerId !== userData.userId && data?.managerNote && (
                        <Row align="middle">
                          <Text clamp={3}>{data?.managerNote}</Text>
                        </Row>
                      )}
                    </Space>
                  </Col>
                </Row>
                <Divider type="horizontal" className="divider" />
              </Col>
            </Row>
            {/* <Row>
              <Col span={leftSpan}>
                <Divider type="horizontal" className="divider" />
                <Row align="middle" justify="space-between">
                  <Col>
                    <Row align="middle">
                      <TShirtIcon className="primaryColor mr-1" />
                      <Row align="middle">
                        <Text bold h3 style={{ color: "inherit" }}>
                          Squad
                        </Text>
                      </Row>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row> */}
            {/* <Row justify="end">
              <span className="mt-2 mb-2">
                <Button
                  type="primary"
                  loading={btnLoading}
                  onClick={() =>
                    !btnLoading
                      ? showUnJoinBtn
                        ? unJoinTeam()
                        : setShowConfirmModal(true)
                      : null
                  }
                >
                  {showUnJoinBtn ? "UNJOIN" : "JOIN"}
                </Button>
              </span>
            </Row> */}
            <Row justify="space-between">
              <Col span={leftSpan} className="colFlex mt-2 mb-2">
                <Row justify="center" align="stretch" className="w100">
                  <Col span={11} className="colFlex allCenter">
                    <Row style={isMobile ? { display: "none" } : {}}>
                      <TeamAIcon className="squadLogos" />
                    </Row>
                    <Row>
                      <Text bold>Team A</Text>
                    </Row>
                    <Row>
                      <Card
                        style={{ height: 36, width: 36, marginTop: 10 }}
                        className="rowFlex allCenter mb-1"
                      >
                        <Text white>{totalA}</Text>
                      </Card>
                    </Row>
                  </Col>
                  <Col span={2} className="colFlex textCenter">
                    <Text
                      style={{ marginTop: 58 }}
                      className="colFlex textCenter"
                    >
                      VS
                    </Text>
                  </Col>
                  <Col span={11} className="colFlex allCenter">
                    <Row style={isMobile ? { display: "none" } : {}}>
                      <TeamBIcon className="squadLogos" />
                    </Row>
                    <Row>
                      <Text bold>Team B</Text>
                    </Row>
                    <Row>
                      <Card
                        style={{ height: 36, width: 36, marginTop: 10 }}
                        className="rowFlex allCenter mb-1"
                      >
                        <Text white>{totalB}</Text>
                      </Card>
                    </Row>
                  </Col>
                </Row>
                <Row justify="space-between" className="w100">
                  <Col offset={0} span={11}>
                    {renderTeam("A")}
                  </Col>
                  <Col offset={2} span={11}>
                    {renderTeam("B")}
                  </Col>
                </Row>
                <Divider type="horizontal" className="divider" />
                <Row>
                  {/* <Button
                    style={{ display: "flex", width: 145 }}
                    onClick={() => handleFollow()}
                    type="text"
                    icon={
                      following ? (
                        <HeartFilled className="shareFollowIcon primaryColor" />
                      ) : (
                        <HeartOutlined className="shareFollowIcon" />
                      )
                    }
                  >
                    {following ? "Following" : "Follow"}
                  </Button> */}
                  {isXs || isSm ? (
                    <Dropdown overlay={renderShareLinks} arrow trigger="click">
                      <Button
                        style={{ display: "flex" }}
                        type="text"
                        icon={<ShareAltOutlined className="shareFollowIcon" />}
                      >
                        Share
                      </Button>
                    </Dropdown>
                  ) : (
                    <Button
                      style={{ display: "flex" }}
                      type="text"
                      onClick={() => copyLink()}
                      icon={<ShareAltOutlined className="shareFollowIcon" />}
                    >
                      Copy Sharable Link
                    </Button>
                  )}
                </Row>
              </Col>
              <Col span={rightSpan} style={isMobile ? { display: "none" } : {}}>
                <Card trans className="noSelect">
                  {renderNoticeBoard()}
                  {openChatInput ? renderMessages() : null}
                </Card>
              </Col>
            </Row>
            {renderFloatingBtn()}
            {renderManagerNoteModal()}
          </div>
        ) : (
          <Empty
            image={Images.emailSent}
            description="Oops! We didn't find the match you are looking for!"
          />
        )}
        {/* <ConfirmModal
          message="Do you want to join the match?"
          visible={showConfirmModal}
          dismiss={(isConfirm) => {
            if (isConfirm) {
              setShowSelectTeamModal(true);
            }
            setShowConfirmModal(false);
          }}
        /> */}
        {/* <SelectTeamModal
          visible={showSelectTeamModal}
          dismiss={(team) => {
            setShowSelectTeamModal(false);
            if (team) {
              joinTeam(team);
            }
          }}
        /> */}
        {/* <SquadModal
          teams={value?.exists ? value.data().teams : {}}
          visible={showSquadModal}
          dismiss={() => setShowSquadModal(false)}
        /> */}
      </Col>
    </>
  );
}

export default GameDetails;
