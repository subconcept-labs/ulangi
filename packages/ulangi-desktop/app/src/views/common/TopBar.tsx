import { observer } from 'mobx-react';
import * as React from 'react';

import {
  LeftButtonContainer,
  RightButtonContainer,
  Title,
  TitleContainer,
  TopBarContainer,
} from './TopBar.style';

export interface TopBarProps {
  title: string | React.ReactElement;
  leftButton?: React.ReactElement;
  rightButton?: React.ReactElement;
}

@observer
export class TopBar extends React.Component<TopBarProps> {
  public render(): React.ReactElement<any> {
    return (
      <TopBarContainer>
        <LeftButtonContainer>{this.props.leftButton}</LeftButtonContainer>
        <TitleContainer>
          {typeof this.props.title === 'string' ? (
            <Title>{this.props.title}</Title>
          ) : (
            this.props.title
          )}
        </TitleContainer>
        <RightButtonContainer>{this.props.rightButton}</RightButtonContainer>
      </TopBarContainer>
    );
  }
}
