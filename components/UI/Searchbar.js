import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";
import React from "react";
import styled from "styled-components";
import { getActiveTheme, theme } from "utils/commonFunctions";
const { Option } = AutoComplete;

const StyledAc = styled(AutoComplete)`
  .ant-input-affix-wrapper > input.ant-input {
    background-color: transparent !important;
    color: ${(props) => theme[props.activeTheme].text + " !important"};
  }
  .ant-input-affix-wrapper-lg {
    border: 0px;
    border-radius: 15px;
    background-color: ${theme.colors.cardTrans} !important;
  }
  .ant-input-lg {
    background-color: ${theme.colors.cardTrans} !important;
  }
  .ant-input-prefix {
    color: ${theme.colors.primary};
    font-size: 20px;
    margin-right: 10px;
  }
  .ant-select-selection-search-input {
    height: 45px;
  }
`;

function Searchbar(props) {
  const activeTheme = getActiveTheme();
  return (
    <StyledAc
      activeTheme={activeTheme}
      dropdownMatchSelectWidth={252}
      className="headerSearchBar"
      {...props}
    >
      <Input
        size="large"
        prefix={<SearchOutlined />}
        placeholder="Find the best your team"
      />
    </StyledAc>
  );
}

export default Searchbar;
