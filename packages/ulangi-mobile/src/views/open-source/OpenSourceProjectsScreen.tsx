/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableDarkModeStore } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { OpenSourceProjectsScreenDelegate } from '../../delegates/open-source/OpenSourceProjectsScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { SectionGroup } from '../section/SectionGroup';
import {
  OpenSourceProjectsScreenStyles,
  darkStyles,
  lightStyles,
} from './OpenSourceProjectsScreen.style';

export interface OpenSourceProjectsScreenProps {
  darkModeStore: ObservableDarkModeStore;
  screenDelegate: OpenSourceProjectsScreenDelegate;
}

@observer
export class OpenSourceProjectsScreen extends React.Component<
  OpenSourceProjectsScreenProps
> {
  private get styles(): OpenSourceProjectsScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen}>
        <ScrollView>
          {this.renderContent()}
          {this.renderProjects()}
        </ScrollView>
      </View>
    );
  }

  private renderContent(): React.ReactElement<any> {
    return (
      <View style={this.styles.content_container}>
        <View style={this.styles.paragraph}>
          <DefaultText style={[this.styles.text, this.styles.bold]}>
            Ulangi is open-source and released under GPL v3.0 license.
          </DefaultText>
        </View>
        <View style={this.styles.paragraph}>
          <DefaultText style={this.styles.text}>
            With this irrevocable license, you can:
          </DefaultText>
          <DefaultText style={this.styles.text}>
            {'\u2022 bring your ideas to the app.'}
          </DefaultText>
          <DefaultText style={this.styles.text}>
            {'\u2022 customize it to suit your own need.'}
          </DefaultText>
          <DefaultText style={this.styles.text}>
            {'\u2022 build more learning tools and games.'}
          </DefaultText>
          <DefaultText style={this.styles.text}>
            {'\u2022 add dictionary you prefer.'}
          </DefaultText>
          <DefaultText style={this.styles.text}>
            {'\u2022 use your own remote server.'}
          </DefaultText>
          <DefaultText style={this.styles.text}>
            {'\u2022 learn to build a scalable app.'}
          </DefaultText>
          <DefaultText style={this.styles.text}>
            {'\u2022 and so on...'}
          </DefaultText>
        </View>
        <View style={this.styles.paragraph}>
          <DefaultText style={this.styles.text}>
            We hope that with this license developers around the world can
            contribute to build a great learning tool together.
          </DefaultText>
        </View>
      </View>
    );
  }

  private renderProjects(): React.ReactElement<any> {
    return (
      <View style={this.styles.projects_container}>
        <SectionGroup header="PROJECTS" theme={this.props.darkModeStore.theme}>
          <View style={this.styles.project_container}>
            <DefaultText style={this.styles.project_title}>
              @minhloi/ulangi
            </DefaultText>
            <DefaultText style={this.styles.project_description}>
              A complete Ulangi project with 15 packages ranging from mobile
              app, server to Google Sheets add-on.
            </DefaultText>
            <View style={this.styles.button_container}>
              <DefaultButton
                text="View on GitHub"
                styles={FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
                  ButtonSize.SMALL,
                )}
                onPress={this.props.screenDelegate.goToGitHub}
              />
            </View>
          </View>
        </SectionGroup>
      </View>
    );
  }
}
