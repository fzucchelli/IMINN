import React from "react";
import { Col, Row } from "antd";
import Text from "@components/UI/Text";
import Card from "@components/UI/Card";
import Images from "@config/images";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";

const CoverImg = () => {
  const { userData } = useSelector(s => s.auth);

  return (
    <>
      <Card className="mb-2">
        <Row align="middle" justify="end">
          <Col flex="auto">
            <div className="textSectonOnImg">
              <Row align="middle">
                <Text h1 bold className="whiteColor coverTitle">
                  {!isEmpty(userData) ? `Hi, ${userData.firstName}` : "Hi"}
                </Text>
              </Row>
              <Row align="middle">
                <Text className="whiteColor coverText">
                  Ready to play games around you, enjoy
                </Text>
              </Row>
            </div>
          </Col>
          <Col>
            <div className="coverGradientWrapper" />
            <img src={Images.goalCover} height="auto" width="100%" />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default CoverImg;
