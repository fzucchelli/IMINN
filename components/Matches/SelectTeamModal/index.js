import React, { useState } from "react";
import p from "prop-types";
import Text from "@components/UI/Text";
import { Col, Modal, Row } from "antd";
import { TeamAIcon, TeamBIcon } from "@components/UI/Icons";
import Button from "@components/UI/Button";

export default function SelectTeamModal(props) {
  const { visible, dismiss } = props;
  const [selectedT, setSelectedT] = useState(null);

  const handleAction = (action) => {
    if (action) {
      dismiss(selectedT);
      return;
    }
    dismiss(false);
    setSelectedT(null);
  };

  const isA = selectedT === "A";
  const isB = selectedT === "B";

  return (
    <Modal
      visible={visible}
      onCancel={() => handleAction(false)}
      centered
      footer={null}
      width="400px"
    >
      <Row>
        <Col span={24} className="colFlex allCenter">
          <Row justify="center">
            <Text black bold className="textCenter mb-1">
              Please, select the team
            </Text>
          </Row>
          <Row justify="center" align="middle">
            <Col
              onClick={() => setSelectedT("A")}
              className={`mr-2 teamsIconSelect ${
                !isA ? "teamsIconSelect-no-select" : ""
              }`}
            >
              <Row>
                <TeamAIcon />
              </Row>
              <Row>
                <Text bold secondary={!isA} primary={isA} className="mt-1">
                  Team A
                </Text>
              </Row>
            </Col>
            <Col
              onClick={() => setSelectedT("B")}
              className={`teamsIconSelect ${
                !isB ? "teamsIconSelect-no-select" : ""
              }`}
            >
              <Row>
                <TeamBIcon />
              </Row>
              <Row>
                <Text bold secondary={!isB} primary={isB} className="mt-1">
                  Team B
                </Text>
              </Row>
            </Col>
          </Row>
          <Row justify="space-between" className="mt-1">
            <Button className="mr-1" onClick={() => handleAction(false)}>
              CANCEL
            </Button>
            <Button type="primary" onClick={() => handleAction(true)}>
              CONFIRM
            </Button>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

SelectTeamModal.defaultProps = {
  visible: false,
  dismiss: () => {},
};

SelectTeamModal.propTypes = {
  visible: p.bool,
  dismiss: p.func,
};
