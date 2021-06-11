/* eslint-disable react/prop-types */
import React from "react";
import { Input } from "antd";
import styled from "styled-components";
import { getActiveTheme, theme } from "utils/commonFunctions";

const StyledInput = styled(Input)`
  background-color: ${theme.colors.cardTrans + " !important"};
  color: ${(props) =>
    props.inModal
      ? theme.colors.black
      : theme[props.activeTheme].text + " !important"};
  border-radius: 10px !important;
  cursor: pointer !important;
  & > input.ant-input {
    padding: 0;
    background-color: transparent !important;
    color: ${(props) =>
      props.inModal
        ? theme.colors.black
        : theme[props.activeTheme].text + " !important"};
  }
  .ant-input {
    &[disabled] {
      cursor: default;
    }
    &-prefix {
      font-size: 20px;
      margin-right: 1rem;
      color: ${theme.colors.primary};
    }
    &-suffix {
      font-size: 20px;
      color: ${theme.colors.primary};
    }
  }
`;

const StyledInputPass = styled(Input.Password)`
  background-color: ${theme.colors.cardTrans + " !important"};
  color: ${(props) => theme[props.activeTheme].text + " !important"};
  border-radius: 10px !important;
  cursor: pointer !important;
  & > input.ant-input {
    padding: 0;
    background-color: transparent !important;
    color: ${(props) => theme[props.activeTheme].text + " !important"};
  }
  .ant-input {
    &[disabled] {
      cursor: default;
    }
    &-prefix {
      font-size: 20px;
      margin-right: 1rem;
      color: ${theme.colors.primary};
    }
    &-suffix {
      font-size: 20px;
      color: ${theme.colors.primary};
    }
    &-password-icon:hover {
      color: rgba(0, 0, 0, 0.85);
    }
  }
`;

const StyledTextArea = styled(Input.TextArea)`
  background-color: ${theme.colors.cardTrans + " !important"};
  color: ${(props) =>
    props.inModal
      ? theme.colors.black
      : theme[props.activeTheme].text + " !important"};
  border-radius: 10px !important;
  cursor: pointer !important;
  & > input.ant-input {
    padding: 0;
    background-color: transparent !important;
    color: ${(props) =>
      props.inModal
        ? theme.colors.black
        : theme[props.activeTheme].text + " !important"};
  }
  .ant-input {
    &[disabled] {
      cursor: default;
    }
    &-prefix {
      font-size: 20px;
      margin-right: 1rem;
      color: ${theme.colors.primary};
    }
    &-suffix {
      font-size: 20px;
      color: ${theme.colors.primary};
    }
  }
`;

function TextInput(props) {
  const activeTheme = getActiveTheme();

  const { textAreaType, passwordType, ...rest } = props;

  if (passwordType) {
    return (
      <StyledInputPass
        bordered={false}
        size="large"
        activeTheme={activeTheme}
        {...rest}
      />
    );
  }
  if (textAreaType) {
    return (
      <StyledTextArea
        bordered={false}
        size="large"
        activeTheme={activeTheme}
        {...rest}
      />
    );
  }
  return (
    <StyledInput
      bordered={false}
      size="large"
      activeTheme={activeTheme}
      {...rest}
    />
  );
}

export default TextInput;
