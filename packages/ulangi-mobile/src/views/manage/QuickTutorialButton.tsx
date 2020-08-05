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
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  QuickTutorialButtonStyles,
  quickTutorialButtonResponsiveStyles,
} from './QuickTutorialButton.style';

export interface QuickTutorialButtonProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  refresh: () => void;
  showQuickTutorial: () => void;
}

@observer
export class QuickTutorialButton extends React.Component<
  QuickTutorialButtonProps
> {
  private get styles(): QuickTutorialButtonStyles {
    return quickTutorialButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        contentContainerStyle={this.styles.scroll_view_container}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={this.props.refresh} />
        }>
        {this.renderText()}
        <TouchableOpacity
          style={this.styles.button_container}
          onPress={this.props.showQuickTutorial}>
          <DefaultText style={this.styles.quick_tutorial}>
            View quick tutorial
          </DefaultText>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  private renderText(): null | React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.add_text}>
        Start collecting words you want to memorize.
      </DefaultText>
    );
  }
}
