import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from './LightBoxAnimatableView.style';

export interface LightBoxAnimatableViewProps {
  style?: React.CSSProperties;
}

@observer
export class LightBoxAnimatableView extends React.Component<
  LightBoxAnimatableViewProps
> {
  public render(): React.ReactElement<any> {
    return (
      <Container style={this.props.style}>{this.props.children}</Container>
    );
  }
}
