/* eslint-disable react/prop-types */
import React from "react";
import { Col, Row } from "antd";
import Images from "@config/images";

function Footer() {
  return (
    <section className="commonContainer">
      <Row className="logoRow">
        <img src={Images.brandLogo} alt="logo" className="logo" />
        <span className="logoText fLogoText">IMINN</span>
      </Row>
      <Row className="linksRow">
        <Col className="links" xs={24} md={14}>
          <a href="/">About</a>
          <a href="/">Features</a>
          <a href="/">Help</a>
          <a href="/">Privacy Policy</a>
          <a href="/signin">Signin</a>
        </Col>
        <Col className="copyRightText" xs={24} md={10}>
          &copy;&nbsp;2021 All Rigth Reserved by IMINN
        </Col>
      </Row>
    </section>
  );
}

export default Footer;
