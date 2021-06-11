import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Col, Row } from "antd";
import Text from "@components/UI/Text";
import { GameListCard } from "@components/Matches/GameListCard";
import db from "@config/firebaseConfig";

function Games() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState([]);

  useEffect(() => {
    db.collection("games")
      .limit(2)
      .get()
      .then((querySnapshot) => {
        setValue(querySnapshot);
        setLoading(false);
      });
  }, []);

  const handleNavigation = (game) => {
    if (game) {
      router.push(`matches/${game.id}`);
    } else {
      router.back();
    }
  };

  const renderGamesCard = () => {
    return value.docs.map((game, index) => {
      return (
        <Col xs={21} sm={21} md={12} lg={12} xl={12} key={index}>
          <GameListCard
            data={game.data()}
            onOpen={() => handleNavigation(game)}
          />
        </Col>
      );
    });
  };

  const renderSkeleton = () => {
    return (
      <>
        <Col xs={21} sm={21} md={12} lg={12} xl={12}>
          <GameListCard skeleton />
        </Col>
        <Col xs={21} sm={21} md={12} lg={12} xl={12}>
          <GameListCard skeleton />
        </Col>
      </>
    );
  };

  return (
    <div>
      <Row justify="space-between" align="middle" className="mb-1 mt-2">
        <Col>
          <Text h2 className="robotoFamily" weight="500">
            My Games
          </Text>
        </Col>
        <Col>
          <Text
            h4
            primary
            className="robotoFamily pointer"
            weight="500"
            onClick={() => router.push("/matches")}
          >
            See all
          </Text>
        </Col>
      </Row>
      <Row
        gutter={[32, 0]}
        justify="space-between"
        wrap={false}
        className="horScrollRow"
      >
        {loading ? renderSkeleton() : renderGamesCard()}
      </Row>
      <Row justify="space-between" align="middle" className="mb-1 mt-2">
        <Col>
          <Text h2 className="robotoFamily" weight="500">
            Games Nearby
          </Text>
        </Col>
        <Col>
          <Text
            h4
            primary
            className="robotoFamily pointer"
            weight="500"
            onClick={() => router.push("/matches")}
          >
            See all
          </Text>
        </Col>
      </Row>
      <Row
        gutter={[32, 0]}
        justify="space-between"
        wrap={false}
        className="horScrollRow"
      >
        {loading ? renderSkeleton() : renderGamesCard()}
      </Row>
    </div>
  );
}

export default Games;
