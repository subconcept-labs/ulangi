import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  DueAndNewCountsStyles,
  dueAndNewCountsResponsiveStyles,
} from './DueAndNewCounts.style';

export interface DueAndNewCountsProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  counts:
    | undefined
    | {
        due: number;
        new: number;
      };
  showLeft: boolean;
}

@observer
export class DueAndNewCounts extends React.Component<DueAndNewCountsProps> {
  private get styles(): DueAndNewCountsStyles {
    return dueAndNewCountsResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        {typeof this.props.counts !== 'undefined' ? (
          <DefaultText style={this.styles.counts}>
            <DefaultText
              style={
                this.props.counts.due > 0 ? this.styles.highlighted_count : {}
              }>
              {this.props.counts.due} due
            </DefaultText>
            <DefaultText> and </DefaultText>
            <DefaultText
              style={
                this.props.counts.new > 0 ? this.styles.highlighted_count : {}
              }>
              {this.props.counts.new} new
            </DefaultText>
            {this.props.showLeft ? <DefaultText> left</DefaultText> : null}
          </DefaultText>
        ) : (
          <ActivityIndicator size="small" />
        )}
      </View>
    );
  }
}
