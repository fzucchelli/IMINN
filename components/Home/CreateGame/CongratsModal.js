import React, { useState } from "react";
import p from "prop-types";
import Text from "@components/UI/Text";
import { Col, Modal, Row, Space } from "antd";
import Images from "@config/images";

export default function CongratsModal(props) {
  const { visible, dismiss } = props;

  return (
    <Modal visible={visible} onCancel={() => dismiss()} centered footer={null}>
      <Row>
        <Col span={24} className="colFlex allCenter">
          <img src={Images.SuccessBadge} height="240px" width="240px" />
          <Text h4 black weight="600" className="mt-1">
            Congratulations!
          </Text>
          <Text black light>
            The match was successfully created.
          </Text>
        </Col>
      </Row>
    </Modal>
  );
}

CongratsModal.defaultProps = {
  visible: false,
  dismiss: () => {},
};

CongratsModal.propTypes = {
  visible: p.bool,
  dismiss: p.func,
};
