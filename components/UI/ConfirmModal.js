import React from "react";
import p from "prop-types";
import Text from "@components/UI/Text";
import { Col, Modal, Row } from "antd";
import Images from "@config/images";
import Button from "./Button";

export default function ConfirmModal(props) {
  const { visible, dismiss, message } = props;

  const handleAction = (action) => {
    dismiss(action);
  };

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
          <img
            src={Images.emailSent}
            height="150px"
            width="150px"
            className="mt-1 mb-1"
          />
          <Row justify="center">
            <Text black bold className="pr-1 pl-1 textCenter">
              {props.message}
            </Text>
          </Row>
          <Row justify="space-between" className="mt-2">
            <Button className="mr-1" onClick={() => handleAction(false)}>
              NO, I DON'T
            </Button>
            <Button type="primary" onClick={() => handleAction(true)}>
              YES, I WANT
            </Button>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

ConfirmModal.defaultProps = {
  message: "",
  visible: false,
  dismiss: () => {},
};

ConfirmModal.propTypes = {
  message: p.string,
  visible: p.bool,
  dismiss: p.func,
};
