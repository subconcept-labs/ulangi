/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { FollowUsScreenIds } from '../../constants/ids/FollowUsScreenIds';
import { FollowUsScreenDelegate } from '../../delegates/follow-us/FollowUsScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  FollowUsScreenStyles,
  followUsScreenResponsiveStyles,
} from './FollowUsScreen.style';

export interface FollowUsScreenProps {
  themeStore: ObservableThemeStore;
  screenDelegate: FollowUsScreenDelegate;
  observableScreen: ObservableScreen;
}

@observer
export class FollowUsScreen extends React.Component<FollowUsScreenProps> {
  public get styles(): FollowUsScreenStyles {
    return followUsScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }
  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={FollowUsScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <View style={this.styles.intro_container}>
          <DefaultText style={this.styles.intro_text}>
            Want to know what we are working on?
          </DefaultText>
        </View>
        <View style={this.styles.section_container}>
          <SectionGroup
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            header="FOLLOW US">
            <SectionRow
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              leftText="Twitter"
              showArrow={true}
              onPress={this.props.screenDelegate.goToTwitter}
            />
            <SectionRow
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              leftText="Reddit"
              showArrow={true}
              onPress={this.props.screenDelegate.goToReddit}
            />
            <SectionRow
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              leftText="Facebook Page"
              showArrow={true}
              onPress={this.props.screenDelegate.goToFacebookPage}
            />
          </SectionGroup>
        </View>
      </Screen>
    );
  }
}
