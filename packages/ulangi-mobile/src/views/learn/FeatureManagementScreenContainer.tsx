import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableFeatureManagementScreen,
  ObservableFeatureSettings,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { FeatureManagementScreenIds } from '../../constants/ids/FeatureManagementScreenIds';
import { FeatureManagementScreenFactory } from '../../factories/learn/FeatureManagementScreenFactory';
import { FeatureManagementScreen } from './FeatureManagementScreen';
import { FeatureManagementScreenStyle } from './FeatureManagementScreenContainer.style';

@observer
export class FeatureManagementScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? FeatureManagementScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : FeatureManagementScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new FeatureManagementScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private featureSettingsDelegate = this.screenFactory.createFeatureSettingsDelegate();

  private originalSettings = this.featureSettingsDelegate.getCurrentSettings();

  protected observableScreen = new ObservableFeatureManagementScreen(
    new ObservableFeatureSettings(
      this.originalSettings.spacedRepetitionEnabled,
      this.originalSettings.writingEnabled,
      this.originalSettings.quizEnabled,
      this.originalSettings.reflexEnabled,
      this.originalSettings.atomEnabled,
    ),
    this.props.componentId,
    ScreenName.FEATURE_MANAGEMENT_SCREEN,
    new ObservableTitleTopBar(
      'Feature Management',
      new ObservableTopBarButton(
        FeatureManagementScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      new ObservableTopBarButton(
        FeatureManagementScreenIds.SAVE_BTN,
        'Save',
        null,
        (): void => {
          this.screenDelegate.save();
        },
      ),
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? FeatureManagementScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : FeatureManagementScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <FeatureManagementScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
      />
    );
  }
}
