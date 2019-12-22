/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableDarkModeStore } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { FollowUsScreenIds } from '../../constants/ids/FollowUsScreenIds';
import { FollowUsScreenDelegate } from '../../delegates/follow-us/FollowUsScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  FollowUsScreenStyles,
  darkStyles,
  lightStyles,
} from './FollowUsScreen.style';

export interface FollowUsScreenProps {
  darkModeStore: ObservableDarkModeStore;
  screenDelegate: FollowUsScreenDelegate;
}

@observer
export class FollowUsScreen extends React.Component<FollowUsScreenProps> {
  public get styles(): FollowUsScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }
  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={FollowUsScreenIds.SCREEN}>
        <View style={this.styles.intro_container}>
          <DefaultText style={this.styles.intro_text}>
            Want to know what we are working on?
          </DefaultText>
        </View>
        <View style={this.styles.section_container}>
          <SectionGroup
            theme={this.props.darkModeStore.theme}
            header="FOLLOW US"
          >
            <SectionRow
              theme={this.props.darkModeStore.theme}
              leftText="Twitter"
              showArrow={true}
              onPress={this.props.screenDelegate.goToTwitter}
            />
            <SectionRow
              theme={this.props.darkModeStore.theme}
              leftText="Reddit"
              showArrow={true}
              onPress={this.props.screenDelegate.goToReddit}
            />
            <SectionRow
              theme={this.props.darkModeStore.theme}
              leftText="Facebook Page"
              showArrow={true}
              onPress={this.props.screenDelegate.goToFacebookPage}
            />
          </SectionGroup>
        </View>
      </View>
    );
  }
}
