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
import { View } from 'react-native';

import { config } from '../../constants/config';
import { ContactUsScreenIds } from '../../constants/ids/ContactUsScreenIds';
import { DefaultText } from '../common/DefaultText';
import { DefaultTextInput } from '../common/DefaultTextInput';
import { KeyboardSpacer } from '../common/KeyboardSpacer';
import {
  FeatureRequestFormStyles,
  darkStyles,
  lightStyles,
} from './FeatureRequestForm.styles';

export interface FeatureRequestFormProps {
  theme: Theme;
  observableScreen: ObservableContactUsScreen;
  styles?: {
    light: FeatureRequestFormStyles;
    dark: FeatureRequestFormStyles;
  };
}

@observer
export class FeatureRequestForm extends React.Component<
  FeatureRequestFormProps
> {
  public get styles(): FeatureRequestFormStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.form}>
        <View style={this.styles.text_container}>
          <DefaultText style={this.styles.text}>
            We take all suggestions seriously. Please let us know what we need
            to add or improve to make this app better. You can also send an
            email to us at{' '}
            <DefaultText style={this.styles.bold}>
              feature@ulangi.com
            </DefaultText>
            .
          </DefaultText>
        </View>
        <View style={this.styles.text_input_container}>
          <DefaultTextInput
            testID={ContactUsScreenIds.TEXT_INPUT}
            style={this.styles.text_input}
            multiline={true}
            placeholder="Enter feature request..."
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
        </View>
        <KeyboardSpacer verticalOffset={16} />
      </View>
    );
  }
}
