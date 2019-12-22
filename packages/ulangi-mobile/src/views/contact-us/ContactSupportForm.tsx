/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableContactUsScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TextInput, View } from 'react-native';

import { config } from '../../constants/config';
import { ContactUsScreenIds } from '../../constants/ids/ContactUsScreenIds';
import { DefaultText } from '../common/DefaultText';
import { KeyboardSpacer } from '../common/KeyboardSpacer';
import {
  ContactSupportFormStyles,
  darkStyles,
  lightStyles,
} from './ContactSupportForm.style';

export interface ContactSupportFormProps {
  theme: Theme;
  observableScreen: ObservableContactUsScreen;
  isGuestEmail: boolean;
  replyToEmail: string;
  styles?: {
    light: ContactSupportFormStyles;
    dark: ContactSupportFormStyles;
  };
}

@observer
export class ContactSupportForm extends React.Component<
  ContactSupportFormProps
> {
  public get styles(): ContactSupportFormStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.form}>
        <View style={this.styles.text_container}>
          <DefaultText style={this.styles.text}>
            {this.props.isGuestEmail ? (
              <DefaultText>
                Please set up your account to send messages here.
              </DefaultText>
            ) : (
              <DefaultText>
                We will reply to your current email. Your email is{' '}
                <DefaultText style={this.styles.bold}>
                  {this.props.replyToEmail}
                </DefaultText>
                .
              </DefaultText>
            )}
            <DefaultText>
              {' '}
              You can also send an email directly to us at{' '}
              <DefaultText style={this.styles.bold}>
                support@ulangi.com
              </DefaultText>
              .
            </DefaultText>
          </DefaultText>
        </View>
        <View style={this.styles.text_input_container}>
          {this.props.isGuestEmail ? null : (
            <TextInput
              testID={ContactUsScreenIds.TEXT_INPUT}
              style={this.styles.text_input}
              multiline={true}
              placeholder="Enter message..."
              value={this.props.observableScreen.text}
              onChangeText={(text): void => {
                this.props.observableScreen.text = text;
              }}
              placeholderTextColor={
                this.props.theme === Theme.LIGHT
                  ? config.styles.light.secondaryTextColor
                  : config.styles.dark.secondaryTextColor
              }
            />
          )}
        </View>
        <KeyboardSpacer verticalOffset={16} />
      </View>
    );
  }
}
