import React, { useState } from "react";
import p from "prop-types";
import Card from "@components/UI/Card";
import { CircleCheckedIcon, CircleOutlinedIcon } from "@components/UI/Icons";
import Text from "@components/UI/Text";
import { sportsCenters } from "@config/staticData";
import { Col, Modal, Row, Space } from "antd";
import { isEqual } from "lodash";
import { theme } from "utils/commonFunctions";
import Button from "@components/UI/Button";

// const sportsCentersList = sportsCenters.filter((s) => {
//   let lc = s && s.Address && s.Address.toString().toLowerCase();
//   console.log(lc);
//   if (lc && lc.includes("leiciester")) {
//     return true;
//   }
// });

export default function SportCenterModal(props) {
  const { visible, dismiss } = props;
  const [checkCenter, setCheckedCenter] = useState({});

  return (
    <Modal
      className="sportsCenterModal"
      title="Select Sports Center"
      visible={visible}
      onOk={() => dismiss(checkCenter)}
      onCancel={() => dismiss()}
      centered
      footer={[
        <>
          <Row justify="center" align="middle">
            <Button type="ghost" key="Add" onClick={() => dismiss()}>
              Return
            </Button>
            <Button
              key="SELECT"
              type="primary"
              onClick={() => dismiss(checkCenter)}
            >
              Submit
            </Button>
          </Row>
        </>,
      ]}
    >
      <Row>
        <Col span={24}>
          <Space
            className="w100"
            direction="vertical"
            split={
              <div
                style={{
                  width: "100%",
                  margin: "10px 0px",
                  borderBottom: `1px solid ${theme.light.secondaryText}`,
                }}
              ></div>
            }
          >
            {sportsCenters.map((c, i) => {
              const selected = isEqual(c, checkCenter);
              return (
                <Row
                  key={c.Contacts}
                  align="middle"
                  className="sporCenterRow pr-1 pl-1"
                  onClick={() => setCheckedCenter(c)}
                >
                  <Card
                    round
                    style={{ width: 35, height: 35 }}
                    className="colFlex allCenter mr-1"
                  >
                    <Text>{i + 1}</Text>
                  </Card>
                  <Col flex="5">
                    <Row>
                      <Text black className="t">
                        {c.Name}
                      </Text>
                    </Row>
                    <Row>
                      <Text black light secondary className="t">
                        {c.Address}
                      </Text>
                    </Row>
                  </Col>
                  <Col flex="1">
                    <Row justify="end" align="middle">
                      {selected ? (
                        <CircleCheckedIcon />
                      ) : (
                        <CircleOutlinedIcon />
                      )}
                    </Row>
                  </Col>
                </Row>
              );
            })}
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}

SportCenterModal.defaultProps = {
  visible: false,
  dismiss: () => {},
};

SportCenterModal.propTypes = {
  visible: p.bool,
  dismiss: p.func,
};
