import React from "react";
import styled from "styled-components";
import { getActiveTheme, theme } from "utils/commonFunctions";

/* Props
  small -> radius 10px (normal 20px) 
  round -> radius 50%
  shadow -> have shadow or not
  type -> trans / themed
*/

const Card = styled.div`
  background-color: ${(props) =>
    (props.themed && theme[getActiveTheme()].cardOpaque) ||
    (props.trans && theme.colors.cardTrans) ||
    theme.colors.primary};
  border-radius: ${(props) =>
    (props.round && "50%") || (props.small && "10px") || "20px"};
  box-shadow: ${(props) =>
    (props.shadow &&
      getActiveTheme() === "light" &&
      "0px 10px 15px 0px #2EBAAB1A") ||
    "none"};
  padding: ${(props) => props.padding || "0px"};
  margin: ${(props) => props.margin || "0px"};
  overflow: hidden;
`;

export default Card;
