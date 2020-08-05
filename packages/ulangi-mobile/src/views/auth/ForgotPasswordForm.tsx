/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ForgotPasswordScreenIds } from '../../constants/ids/ForgotPasswordScreenIds';
import { DefaultText } from '../common/DefaultText';
import {
  ForgotPasswordFormStyles,
  forgotPasswordFormResponsiveStyles,
} from './ForgotPasswordForm.style';
import { InputField } from './InputField';
import { SubmitButton } from './SubmitButton';

export interface ForgotPasswordFormProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  email: IObservableValue<string>;
  submit: () => void;
  back: () => void;
}

@observer
export class ForgotPasswordForm extends React.Component<
  ForgotPasswordFormProps
> {
  private get styles(): ForgotPasswordFormStyles {
    return forgotPasswordFormResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.form}>
        <InputField
          testID={ForgotPasswordScreenIds.EMAIL_INPUT}
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          value={this.props.email}
          autoCapitalize="none"
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="done"
          onSubmitEditing={this.props.submit}
        />
        <SubmitButton
          testID={ForgotPasswordScreenIds.SUBMIT_BTN}
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          buttonText="Submit"
          onSubmit={this.props.submit}
        />
        <View style={this.styles.other_containers}>
          <TouchableOpacity
            testID={ForgotPasswordScreenIds.BACK_BTN}
            style={this.styles.touchable_text}
            onPress={this.props.back}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <DefaultText style={this.styles.other_text}>
              Back to Sign In
            </DefaultText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
