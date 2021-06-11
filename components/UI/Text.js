import React from "react";
import styled from "styled-components";
import { getActiveTheme, theme } from "utils/commonFunctions";

const Text = styled.span`
  font-size: ${(props) =>
    (props.h1 && "64px") ||
    (props.h2 && "30px") ||
    (props.h3 && "24px") ||
    (props.h4 && "20px") ||
    (props.small && "14px") ||
    (props.footnote && "13px") ||
    "16px"};
  color: ${(props) =>
    (props.primary && theme.colors.primary) ||
    (props.secondary && theme[getActiveTheme()].secondaryText) ||
    (props.white && theme.colors.white) ||
    (props.black && theme.colors.black) ||
    theme[getActiveTheme()].text};
  font-weight: ${(props) =>
    (props.bold && "bold") ||
    (props.semiBold && "600") ||
    (props.light && "400") ||
    props?.weight ||
    "inherit"};
  line-height: ${(props) =>
    (props.h1 && "64px") || (props.h2 && "30px") || "inherit"};
  display: ${(props) => (props.clamp && "-webkit-box") || "inherit"};
  -webkit-box-orient: ${(props) => (props.clamp && "verticle") || "inherit"};
  -webkit-line-clamp: ${(props) => props.clamp || "inherit"};
  overflow: ${(props) => (props.clamp && "hidden") || "inherit"};

  font-size: ${(props) =>
    (props.h1 && "48px") ||
    (props.h2 && "28px") ||
    (props.h3 && "22px") ||
    (props.h4 && "18px") ||
    (props.small && "12px") ||
    (props.footnote && "10px") ||
    "16px"};
`;

export default Text;
