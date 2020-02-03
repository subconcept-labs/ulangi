import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableFeatureManagementScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { config } from '../../constants/config';
import { FeatureManagementScreenIds } from '../../constants/ids/FeatureManagementScreenIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  FeatureManagementScreenStyles,
  darkStyles,
  lightStyles,
  sectionRowDarkStyles,
  sectionRowLightStyles,
} from './FeatureManagementScreen.style';

export interface FeatureManagementScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableFeatureManagementScreen;
}

@observer
export class FeatureManagementScreen extends React.Component<
  FeatureManagementScreenProps
> {
  private get styles(): FeatureManagementScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        style={this.styles.screen}
        testID={FeatureManagementScreenIds.SCREEN}>
        {this.renderMessage()}
        {this.renderSections()}
      </ScrollView>
    );
  }

  private renderMessage(): React.ReactElement<any> {
    return (
      <View style={this.styles.message_container}>
        <DefaultText style={this.styles.message}>
          To keep the app clean, enable only features you want to use.
        </DefaultText>
      </View>
    );
  }

  private renderSections(): React.ReactElement<any> {
    return (
      <SectionGroup theme={this.props.themeStore.theme} key="toggle">
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Spaced Repetition"
          customRight={
            <DefaultButton
              testID={FeatureManagementScreenIds.SPACED_REPETITION_BTN}
              text={
                this.props.observableScreen.featureSettings
                  .spacedRepetitionEnabled === true
                  ? 'Enabled'
                  : 'Disabled'
              }
              styles={FullRoundedButtonStyle.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings
                  .spacedRepetitionEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.spacedRepetitionEnabled = !this
                  .props.observableScreen.featureSettings
                  .spacedRepetitionEnabled;
              }}
            />
          }
          description="Spaced Repetition helps you to memorize terms with less time by using a smart scheduling algorithm."
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Writing"
          customRight={
            <DefaultButton
              testID={FeatureManagementScreenIds.WRITING_BTN}
              text={
                this.props.observableScreen.featureSettings.writingEnabled ===
                true
                  ? 'Enabled'
                  : 'Disabled'
              }
              styles={FullRoundedButtonStyle.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings.writingEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.writingEnabled = !this
                  .props.observableScreen.featureSettings.writingEnabled;
              }}
            />
          }
          description="Writing helps you to learn terms more effectively by maximizing your engagement."
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Quiz"
          customRight={
            <DefaultButton
              testID={FeatureManagementScreenIds.QUIZ_BTN}
              text={
                this.props.observableScreen.featureSettings.quizEnabled === true
                  ? 'Enabled'
                  : 'Disabled'
              }
              styles={FullRoundedButtonStyle.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings.quizEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.quizEnabled = !this
                  .props.observableScreen.featureSettings.quizEnabled;
              }}
            />
          }
          description="Quiz is designed to test what you learned."
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Reflex"
          customRight={
            <DefaultButton
              testID={FeatureManagementScreenIds.REFLEX_BTN}
              text={
                this.props.observableScreen.featureSettings.reflexEnabled ===
                true
                  ? 'Enabled'
                  : 'Disabled'
              }
              styles={FullRoundedButtonStyle.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings.reflexEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.reflexEnabled = !this
                  .props.observableScreen.featureSettings.reflexEnabled;
              }}
            />
          }
          description="Reflex is a mini-game to test memory retrieval (recall and recognization) of your words."
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Atom"
          customRight={
            <DefaultButton
              testID={FeatureManagementScreenIds.ATOM_BTN}
              text={
                this.props.observableScreen.featureSettings.atomEnabled === true
                  ? 'Enabled'
                  : 'Disabled'
              }
              styles={FullRoundedButtonStyle.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings.atomEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.atomEnabled = !this
                  .props.observableScreen.featureSettings.atomEnabled;
              }}
            />
          }
          description="Atom is a mini-game to practice terms with ease and fun."
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
      </SectionGroup>
    );
  }
}
