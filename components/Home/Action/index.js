import React, { useContext } from "react";
import { Col, Row } from "antd";
import Text from "@components/UI/Text";
import Card from "@components/UI/Card";
import {
  CreateGameIcon,
  CreateMatchIcon,
  CreateTeamIcon,
} from "@components/UI/Icons";
import { MenuCtx } from "@components";

const ACTION_MENUS = [
  {
    id: 1,
    title: "Create Game",
    text: "Create new game",
    icon: <CreateGameIcon />,
  },
  {
    id: 2,
    title: "Create Team",
    text: "Create new team",
    icon: <CreateTeamIcon />,
  },
  {
    id: 3,
    title: "Create Match",
    text: "Create new match",
    icon: <CreateMatchIcon />,
  },
];

function Action(props) {
  const mc = useContext(MenuCtx);

  const renderActionItems = () => {
    return ACTION_MENUS.map((mI) => {
      return (
        <Col span={8} key={mI.id}>
          <Card
            themed
            shadow
            padding="1.5rem"
            style={{ cursor: "pointer" }}
            onClick={() => mc.setActiveMenu(6)}
          >
            <Row justify="start" align="middle">
              <Col>
                <Card small padding="12px" className="rowFlex allCenter mr-1">
                  {mI.icon}
                </Card>
              </Col>
              <Col>
                <Row>
                  <Text h4 bold>
                    {mI.title}
                  </Text>
                </Row>
                <Row>
                  <Text light>{mI.text}</Text>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      );
    });
  };

  return (
    <div>
      <Row>
        <Text h2 className="robotoFamily mb-1 mt-1" weight="500">
          Action
        </Text>
      </Row>
      <Row gutter={[32, 0]} justify="space-between">
        {renderActionItems()}
      </Row>
    </div>
  );
}

export default Action;
