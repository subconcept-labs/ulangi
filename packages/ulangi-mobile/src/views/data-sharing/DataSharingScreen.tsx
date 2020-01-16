import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDataSharingScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { config } from '../../constants/config';
import { DataSharingScreenIds } from '../../constants/ids/DataSharingScreenIds';
import { DataSharingScreenDelegate } from '../../delegates/data-sharing/DataSharingScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import {
  DataSharingScreenStyles,
  darkStyles,
  lightStyles,
} from './DataSharingScreen.style';

export interface DataSharingScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableDataSharingScreen;
  screenDelegate: DataSharingScreenDelegate;
}

export class DataSharingScreen extends React.Component<DataSharingScreenProps> {
  public get styles(): DataSharingScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }
  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        testID={DataSharingScreenIds.SCREEN}
        style={this.styles.screen}>
        <DefaultText style={this.styles.title}>
          Help us to improve Ulangi by sharing your data with us.
        </DefaultText>
        <DefaultText style={this.styles.paragraph}>
          When you opt-in data sharing,{' '}
        </DefaultText>
        <DefaultText style={this.styles.paragraph}>
          - in case of errors, we collect crash reports which include logs,
          stack traces and navigation history. This information help us to
          discover bugs, to prioritize them and to fix them easier.
        </DefaultText>
        <DefaultText style={this.styles.paragraph}>
          - in order to improve user experience, we collect your events and
          actions. This collected data is used to analyze user behaviors through
          third party products. requests.
        </DefaultText>

        {this.props.observableScreen.optedIn === true ? (
          <DefaultText style={this.styles.paragraph}>
            You already opted-in.
          </DefaultText>
        ) : null}
        <View style={this.styles.button_container}>
          <DefaultButton
            text={
              this.props.observableScreen.optedIn === true
                ? 'Opt-out data sharing'
                : 'Opt-in data sharing'
            }
            styles={FullRoundedButtonStyle.getFullBackgroundStyles(
              ButtonSize.LARGE,
              this.props.observableScreen.optedIn === true
                ? 'orangered'
                : config.styles.primaryColor,
              '#fff',
            )}
            onPress={this.props.screenDelegate.toggle}
          />
        </View>
      </ScrollView>
    );
  }
}
