import React from "react";
import Images from "@config/images";
import { Col, Row } from "antd";
import useMediaQuery from "utils/useMediaQuery";

function Features() {
  const FeatureItem = ({ text, icon, classN }) => {
    const { isXs, isSm, isMd, isLg, isXl } = useMediaQuery();
    return (
      <Col xs={12} md={6} className="colFlex alignCenter">
        <Row className={`${classN} fIconWrapper`}>
          <img src={icon} className="featureIcon" />
        </Row>
        <Row justify="center">
          <Col span={20} className="featureText">
            {text}
          </Col>
        </Row>
      </Col>
    );
  };
  return (
    <section className="commonContainer">
      <Row className="sectionHeading semiBold" justify="center" align="middle">
        <span className="primaryColor">IMINN&nbsp;</span>
        <span> FEATURES</span>
      </Row>
      <Row justify="center">
        <FeatureItem
          text="Create games and invite others via a joining link"
          classN="primaryBg"
          icon={Images.create}
        />
        <FeatureItem
          text="Find games in your area or your match criteria"
          classN="pinkBg"
          icon={Images.search}
        />
        <FeatureItem
          text="Scout for players if you have last minute drop offs"
          classN="orangeBg"
          icon={Images.target}
        />
        <FeatureItem
          text="Simply join a team when you want to play"
          classN="blueBg"
          icon={Images.join}
        />
      </Row>
    </section>
  );
}

export default Features;
