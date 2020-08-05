import { ButtonSize } from '@ulangi/ulangi-common/enums';
import {
  ObservableFeatureManagementScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { config } from '../../constants/config';
import { FeatureManagementScreenIds } from '../../constants/ids/FeatureManagementScreenIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  FeatureManagementScreenStyles,
  featureManagementScreenResponsiveStyles,
  sectionRowResponsiveStyles,
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
    return featureManagementScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={FeatureManagementScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <ScrollView>
          {this.renderMessage()}
          {this.renderSections()}
        </ScrollView>
      </Screen>
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
      <SectionGroup
        key="toggle"
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}>
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
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
              styles={fullRoundedButtonStyles.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings
                  .spacedRepetitionEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.spacedRepetitionEnabled = !this
                  .props.observableScreen.featureSettings
                  .spacedRepetitionEnabled;
              }}
            />
          }
          description="Spaced Repetition helps you to memorize terms with less time by using a smart scheduling algorithm."
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
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
              styles={fullRoundedButtonStyles.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings.writingEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.writingEnabled = !this
                  .props.observableScreen.featureSettings.writingEnabled;
              }}
            />
          }
          description="Writing helps you to learn terms more effectively by maximizing your engagement."
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Quiz"
          customRight={
            <DefaultButton
              testID={FeatureManagementScreenIds.QUIZ_BTN}
              text={
                this.props.observableScreen.featureSettings.quizEnabled === true
                  ? 'Enabled'
                  : 'Disabled'
              }
              styles={fullRoundedButtonStyles.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings.quizEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.quizEnabled = !this
                  .props.observableScreen.featureSettings.quizEnabled;
              }}
            />
          }
          description="Quiz is designed to test what you learned."
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
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
              styles={fullRoundedButtonStyles.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings.reflexEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.reflexEnabled = !this
                  .props.observableScreen.featureSettings.reflexEnabled;
              }}
            />
          }
          description="Reflex is a mini-game to test memory retrieval (recall and recognization) of your words."
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Atom"
          customRight={
            <DefaultButton
              testID={FeatureManagementScreenIds.ATOM_BTN}
              text={
                this.props.observableScreen.featureSettings.atomEnabled === true
                  ? 'Enabled'
                  : 'Disabled'
              }
              styles={fullRoundedButtonStyles.getOutlineStyles(
                ButtonSize.SMALL,
                this.props.observableScreen.featureSettings.atomEnabled
                  ? config.styles.primaryColor
                  : 'orangered',
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.observableScreen.featureSettings.atomEnabled = !this
                  .props.observableScreen.featureSettings.atomEnabled;
              }}
            />
          }
          description="Atom is a mini-game to practice terms with ease and fun."
          styles={sectionRowResponsiveStyles}
        />
      </SectionGroup>
    );
  }
}
