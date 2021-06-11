/* eslint-disable react/prop-types */
import Button from "@components/UI/Button";
import Card from "@components/UI/Card";
import Text from "@components/UI/Text";
import Images from "@config/images";
import { Avatar, Col, Row, Skeleton } from "antd";
import { isEmpty } from "lodash";
import React from "react";
import { getInitials, theme } from "utils/commonFunctions";

export function GameListCard({ data, onOpen, skeleton = false }) {
  if (skeleton) {
    return <Skeleton.Button active className="gameListCardSkeleton" />;
  }

  const type = "Match Now";
  const img = data?.image?.secure_url || false;
  let players = [];
  if (!isEmpty(data.teams.teamA)) {
    players = [...players, ...data.teams.teamA];
  }
  if (!isEmpty(data.teams.teamB)) {
    players = [...players, ...data.teams.teamB];
  }
  return (
    <>
      <Card themed shadow padding="1.5rem" style={{ height: "100%" }}>
        <Row justify="space-between" align="top">
          <Col>
            {img ? (
              <img
                src={img}
                width="134px"
                height="132px"
                style={{
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            ) : (
              <Card
                trans
                small
                padding="12px"
                className="rowFlex allCenter mr-1"
              >
                <img
                  src={Images.emailSent}
                  width="75px"
                  height="75px"
                  className="m-1"
                />
              </Card>
            )}
          </Col>
          <Col>
            <Row justify="end" align="top">
              <Text h4 semiBold primary={type === "Match Now"}>
                {type}
              </Text>
            </Row>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 10 }}>
          <Text h3 bold>
            {data?.pitch?.label}
          </Text>
        </Row>
        <Row align="top">
          <Text light>{data.dateTime}</Text>
        </Row>
        <Row align="top">
          <Text>{data?.center?.Name || "-"}</Text> ,&nbsp;
          <Text light>{data?.center?.Address || "-"}</Text>
        </Row>
        <Row justify="space-between" align="middle" className="mt-2">
          <Col>
            <Row>
              <Avatar.Group
                maxCount={5}
                size={35}
                maxStyle={{ color: theme.colors.primary }}
              >
                {players.map((n, index) => {
                  return (
                    <Avatar key={index} src={n.avatar}>
                      {getInitials(n)}
                    </Avatar>
                  );
                })}
              </Avatar.Group>
            </Row>
          </Col>
          <Col>
            <Button
              size="large"
              type="primary"
              shape="round"
              onClick={() => onOpen()}
            >
              SEE
            </Button>
            {/* {type === "Match Now" ? (
              <Button size="large" type="primary" shape="round">
                SEE
              </Button>
            ) : (
              <Button size="large" type="primary" shape="round">
                FULL
              </Button>
            )} */}
          </Col>
        </Row>
      </Card>
    </>
  );
}
