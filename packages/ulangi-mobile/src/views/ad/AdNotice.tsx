/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { AdNoticeStyles, adNoticeResponsiveStyles } from './AdNotice.style';

export interface AdNoticeProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  upgradeToPremium: () => void;
}

@observer
export class AdNotice extends React.Component<AdNoticeProps> {
  private get styles(): AdNoticeStyles {
    return adNoticeResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.text}>
          To support development and maintenance of this open-source project, an
          ad will be shown next.{' '}
          <DefaultText
            style={this.styles.highlighted}
            onPress={this.props.upgradeToPremium}>
            You can also upgrade to remove ads permanently.
          </DefaultText>
        </DefaultText>
      </View>
    );
  }
}
