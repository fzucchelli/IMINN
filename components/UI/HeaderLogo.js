import React from "react";
import Images from "@config/images";
import { Row } from "antd";
import Text from "./Text";

export default function HeaderLogo() {
  return (
    <Row>
      <div className="brandLogoContainer rowFlex allCenter mb-2">
        <img src={Images.brandLogo} />
        <Text className="logoText logoText2">IMINN</Text>
      </div>
    </Row>
  );
}
