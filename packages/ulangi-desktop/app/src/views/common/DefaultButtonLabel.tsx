import styled from 'styled-components';

export const DefaultButton = styled.button`
  background-color: #fff;
  border-color: #bbb;
  border-width: 1px;
  border-style: solid;
  color: #666;
  font-size: 15px;
  padding: 8px 14px;
  font-family: Helvetica, Arial;
  font-weight: 700;
  border-radius: 6px;
  box-shadow: 0px 1px 3px #00000025;

  :hover {
    background-color: #f1f1f1;
  }

  :active {
    background-color: #eee;
    box-shadow: 0px 1px 3px #00000000;
  }
`;
