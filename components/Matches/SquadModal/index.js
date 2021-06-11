import React, { useState } from "react";
import p from "prop-types";
import Card from "@components/UI/Card";
import { TeamAIcon, TeamBIcon } from "@components/UI/Icons";
import Text from "@components/UI/Text";
import { Avatar, Badge, Col, Modal, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { capitalize, isArray, isEmpty } from "lodash";

export default function SquadModal(props) {
  const { visible, dismiss, teams } = props;
  console.log("===> ~ SquadModal ~ teams", teams);

  const renderTeam = (name) => {
    if (name == "A" && !isEmpty(teams.teamA) && isArray(teams.teamA)) {
      return teams.teamA.map((p, index) => {
        return (
          <Row align="middle" key={index} className="mt-1 pl-2">
            <Col flex="60px">
              <Badge count={2} overflowCount={999} offset={[-5, 3]}>
                <Avatar
                  size={50}
                  src={p.avatar || ""}
                  icon={<UserOutlined />}
                />
              </Badge>
            </Col>
            <Col flex="auto">
              <Row>
                <Text black bold small>
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
      return teams.teamB.map((p, index) => {
        return (
          <Row align="middle" key={index} className="mt-1 pl-2">
            <Col flex="60px">
              <Avatar size={50} src={p.avatar || ""} icon={<UserOutlined />} />
            </Col>
            <Col flex="auto">
              <Row>
                <Text black bold small>
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
    return <></>;
  };

  let totalA = 0;
  let totalB = 0;

  return (
    <Modal visible={visible} onCancel={() => dismiss()} centered footer={null}>
      <Row>
        <Col span={24} className="colFlex allCenter">
          <Row justify="center">
            <Text black bold className="textCenter mb-1">
              Squad
            </Text>
          </Row>
          <Row justify="center" align="stretch">
            <Col className="colFlex allCenter">
              <Row>
                <TeamAIcon stle={{ height: 80, width: 80 }} />
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
            <Col className="colFlex mr-2 ml-2">
              <Text black style={{ marginTop: 58 }}>
                VS
              </Text>
            </Col>
            <Col className="colFlex allCenter">
              <Row>
                <TeamBIcon stle={{ height: 80, width: 80 }} />
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
            <Col span={12}>{renderTeam("A")}</Col>
            <Col span={12}>{renderTeam("B")}</Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

SquadModal.defaultProps = {
  visible: false,
  dismiss: () => {},
  teams: {},
};

SquadModal.propTypes = {
  visible: p.bool,
  dismiss: p.func,
  teams: p.object,
};
