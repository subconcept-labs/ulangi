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
  ReportAnErrorFormStyles,
  reportAnErrorFormResponsiveStyles,
} from './ReportAnErrorForm.style';

export interface ReportAnErrorFormProps {
  theme: Theme;
  observableScreen: ObservableContactUsScreen;
  styles?: {
    light: ReportAnErrorFormStyles;
    dark: ReportAnErrorFormStyles;
  };
}

@observer
export class ReportAnErrorForm extends React.Component<ReportAnErrorFormProps> {
  public get styles(): ReportAnErrorFormStyles {
    return reportAnErrorFormResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.form}>
        <View style={this.styles.text_container}>
          <DefaultText style={this.styles.text}>
            You can report any kinds of content errors here. You can also send
            an email directly to us at{' '}
            <DefaultText style={this.styles.bold}>error@ulangi.com</DefaultText>
            .
          </DefaultText>
        </View>
        <View style={this.styles.text_input_container}>
          <DefaultTextInput
            testID={ContactUsScreenIds.TEXT_INPUT}
            style={this.styles.text_input}
            multiline={true}
            placeholder="Enter error information..."
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
