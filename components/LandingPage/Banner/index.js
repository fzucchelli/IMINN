/* eslint-disable react/prop-types */
import React from "react";
import { useRouter } from "next/router";
import { Button, Row } from "antd";

function Banner() {
  const router = useRouter();

  return (
    <section className="bannerContainer">
      <Row className="bannerTitle whiteColor">Become the first user</Row>
      <Row>
        <Button
          type="primary"
          size="large"
          shape="round"
          className="bigBtn"
          onClick={() => router.push("/get-early-access")}
        >
          Get early access
        </Button>
      </Row>
    </section>
  );
}

export default Banner;
