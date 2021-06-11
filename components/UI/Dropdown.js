/* eslint-disable react/prop-types */
import { Select } from "antd";
import React from "react";
import styled from "styled-components";
import { getActiveTheme, theme } from "utils/commonFunctions";
const { Option } = Select;

const StyledSelect = styled(Select)`
  color: ${(props) => theme[props.activeTheme].text + " !important"};
`;

function Dropdown(props) {
  const activeTheme = getActiveTheme();
  return (
    <StyledSelect
      style={{ width: "100%" }}
      className="dropDownStyle"
      activeTheme={activeTheme}
      dropdownMatchSelectWidth={252}
      {...props}
    >
      {props.children}
    </StyledSelect>
  );
}

export default Dropdown;
