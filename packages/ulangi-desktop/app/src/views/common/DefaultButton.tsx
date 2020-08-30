import styled from 'styled-components';

export const DefaultButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-color: #bbb;
  border-width: 1px;
  border-style: solid;
  color: #545454;
  font-size: 15px;
  height: 32px;
  padding: 0px 14px;
  font-family: Helvetica, Arial;
  border-radius: 5px;
  box-shadow: 0px 1px 3px #00000020;

  :hover {
    background-color: #f1f1f1;
  }

  :active {
    background-color: #eee;
    box-shadow: 0px 1px 3px #00000000;
  }
`;
