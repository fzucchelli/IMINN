/* eslint-disable react/prop-types */
import React from "react";
import { Button as ABtn } from "antd";
import styled from "styled-components";
import { getActiveTheme, theme } from "utils/commonFunctions";

const StyledButton = styled(ABtn)`
  font-weight: bold !important;
  box-shadow: 0px 10x 20px rgba(54, 53, 52, 0.219) !important;
  height: 38px;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.type === "text" && "transparent !important"};
  &:hover {
    &,
    & span {
      color: ${(props) =>
        ["ghost", "text"].includes(props.type) && theme.colors.primary};
    }
    background-color: ${(props) =>
      props.type === "text" && "transparent !important"};
  }
`;

function Button(props) {
  const activeTheme = getActiveTheme();
  const { children, ...rest } = props;
  return (
    <StyledButton shape="round" activeTheme={activeTheme} {...rest}>
      {children}
    </StyledButton>
  );
}

export default Button;
