/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableCategorizeScreen,
  ObservableCategoryFormState,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { CategorizeScreenIds } from '../../constants/ids/CategorizeScreenIds';
import { CategorizeScreenFactory } from '../../factories/category/CategorizeScreenFactory';
import { CategorizeScreen } from './CategorizeScreen';
import { CategorizeScreenStyle } from './CategorizeScreenContainer.style';

export interface CategorizeScreenPassedProps {
  categoryName: undefined | string;
  selectedVocabularyIds: readonly string[];
}

@observer
export class CategorizeScreenContainer extends Container<
  CategorizeScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? CategorizeScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : CategorizeScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new CategorizeScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableCategorizeScreen(
    new ObservableCategoryFormState(
      this.props.passedProps.categoryName || '',
      null,
      false,
      observable.box(ActivityState.INACTIVE),
    ),
    ScreenName.CATEGORIZE_SCREEN,
    new ObservableTitleTopBar(
      'Categorize',
      new ObservableTopBarButton(
        CategorizeScreenIds.BACK_BTN,
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
        CategorizeScreenIds.SAVE_BTN,
        'Save',
        null,
        (): void => {
          Keyboard.dismiss();
          if (this.observableScreen.categoryFormState.categoryName === '') {
            this.screenDelegate.showMoveToUncategorizedDialog(
              (): void => {
                this.screenDelegate.save(
                  this.props.passedProps.selectedVocabularyIds,
                );
              },
            );
          } else {
            this.screenDelegate.save(
              this.props.passedProps.selectedVocabularyIds,
            );
          }
        },
      ),
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.autoRefreshCategorySuggestionsOnNameChange(500);
    this.screenDelegate.prepareAndFetchCategorySuggestions();
  }

  public componentWillUnmount(): void {
    this.screenDelegate.clearFetchCategorySuggestions();
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? CategorizeScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : CategorizeScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <CategorizeScreen
        themeStore={this.props.rootStore.themeStore}
        screenDelegate={this.screenDelegate}
        observableScreen={this.observableScreen}
      />
    );
  }
}
