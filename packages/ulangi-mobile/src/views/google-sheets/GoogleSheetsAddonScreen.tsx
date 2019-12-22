/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeStore,
  ObservableGoogleSheetsAddOnScreen,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { TextInput, View } from 'react-native';

import { config } from '../../constants/config';
import { GoogleSheetsAddOnScreenIds } from '../../constants/ids/GoogleSheetsAddOnScreenIds';
import { GoogleSheetsAddOnScreenDelegate } from '../../delegates/google-sheets/GoogleSheetsAddOnScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  GoogleSheetsAddOnScreenStyles,
  darkStyles,
  lightStyles,
} from './GoogleSheetsAddOnScreen.style';

export interface GoogleSheetsAddOnScreenProps {
  observableScreen: ObservableGoogleSheetsAddOnScreen;
  darkModeStore: ObservableDarkModeStore;
  userStore: ObservableUserStore;
  screenDelegate: GoogleSheetsAddOnScreenDelegate;
}

@observer
export class GoogleSheetsAddOnScreen extends React.Component<
  GoogleSheetsAddOnScreenProps
> {
  public get styles(): GoogleSheetsAddOnScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View
        style={this.styles.screen}
        testID={GoogleSheetsAddOnScreenIds.SCREEN}
      >
        <View style={this.styles.intro_container}>
          <DefaultText style={this.styles.intro_text}>
            With this add-on, you can easily manage terms through Google Sheets.
            You can perform bulk edits, import multiple terms or export them
            directly on your desktop.
          </DefaultText>
        </View>
        <View style={this.styles.section_container}>
          <SectionGroup theme={this.props.darkModeStore.theme} header="API KEY">
            {typeof this.props.observableScreen.apiKey === 'undefined'
              ? this.renderPasswordInput()
              : this.renderApiKey()}
          </SectionGroup>
          <SectionGroup
            theme={this.props.darkModeStore.theme}
            header="TUTORIALS"
          >
            <SectionRow
              theme={this.props.darkModeStore.theme}
              leftText="How to install add-on"
              showArrow={true}
              onPress={(): void =>
                this.props.screenDelegate.goToLink(
                  config.links.installUlangiSheetsAddOnTutorial
                )
              }
            />
            <SectionRow
              theme={this.props.darkModeStore.theme}
              leftText="How to use add-on"
              showArrow={true}
              onPress={(): void =>
                this.props.screenDelegate.goToLink(
                  config.links.useUlangiSheetsAddOnTutorial
                )
              }
            />
          </SectionGroup>
        </View>
      </View>
    );
  }

  private renderPasswordInput(): React.ReactElement<any> {
    if (
      this.props.userStore.existingCurrentUser.email.endsWith(
        config.general.guestEmailDomain
      )
    ) {
      return (
        <SectionRow
          theme={this.props.darkModeStore.theme}
          leftText="To get API key, please set up your account first."
        />
      );
    } else {
      return (
        <SectionRow
          theme={this.props.darkModeStore.theme}
          customLeft={
            <TextInput
              style={this.styles.password_input}
              secureTextEntry={true}
              autoCapitalize="none"
              placeholder="Enter password here to show API key"
              onChangeText={(text): void => {
                this.props.observableScreen.password = text;
              }}
              onSubmitEditing={this.props.screenDelegate.getApiKey}
              placeholderTextColor={
                this.props.darkModeStore.theme === Theme.LIGHT
                  ? config.styles.light.secondaryTextColor
                  : config.styles.dark.secondaryTextColor
              }
            />
          }
        />
      );
    }
  }

  private renderApiKey(): React.ReactElement<any> {
    return (
      <SectionRow
        theme={this.props.darkModeStore.theme}
        customLeft={
          <DefaultText selectable={true}>
            {this.props.observableScreen.apiKey}
          </DefaultText>
        }
        description={this.renderDescription()}
      />
    );
  }

  private renderDescription(): React.ReactElement<any> {
    return (
      <View>
        {typeof this.props.observableScreen.expiredAt !== 'undefined' &&
        this.props.observableScreen.expiredAt !== null ? (
          <DefaultText style={this.styles.expired_text}>
            {`Expired at ${moment(this.props.observableScreen.expiredAt).format(
              'MMM Do YYYY'
            )}`}
          </DefaultText>
        ) : null}
        <View style={this.styles.action_container}>
          <DefaultText
            style={this.styles.primary_text}
            onPress={this.props.screenDelegate.copyApiKeyToClipboard}
          >
            Copy
          </DefaultText>
          <DefaultText style={this.styles.dot}>{'\u00B7'}</DefaultText>
          <DefaultText
            style={this.styles.primary_text}
            onPress={this.props.screenDelegate.sendToEmail}
          >
            Send to email
          </DefaultText>
          <DefaultText style={this.styles.dot}>{'\u00B7'}</DefaultText>
          <DefaultText
            style={this.styles.invalidate_text}
            onPress={this.props.screenDelegate.showInvalidateApiKeyConfirmation}
          >
            Invalidate
          </DefaultText>
        </View>
      </View>
    );
  }
}
