/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableCategoryFormState,
  ObservableCategorySelectorScreen,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { CategorySelectorScreenIds } from '../../constants/ids/CategorySelectorScreenIds';
import { CategorySelectorScreenFactory } from '../../factories/category/CategorySelectorScreenFactory';
import { CategorySelectorScreen } from './CategorySelectorScreen';
import { CategorySelectorScreenStyle } from './CategorySelectorScreenContainer.style';

export interface CategorySelectorScreenPassedProps {
  initialCategoryName: undefined | string;
  onSelect: (categoryName: string) => void;
}

@observer
export class CategorySelectorScreenContainer extends Container<
  CategorySelectorScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? CategorySelectorScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : CategorySelectorScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private categorySelectorScreenFactory = new CategorySelectorScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableCategorySelectorScreen(
    new ObservableCategoryFormState(
      this.props.passedProps.initialCategoryName || '',
      null,
      false,
      observable.box(ActivityState.INACTIVE),
    ),
    ScreenName.CATEGORY_SELECTOR_SCREEN,
  );

  private navigatorDelegate = this.categorySelectorScreenFactory.createNavigatorDelegate();

  private screenDelegate = this.categorySelectorScreenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.autoRefreshCategorySuggestionsOnNameChange(500);
    this.screenDelegate.prepareAndFetchCategorySuggestions();
  }

  public componentWillUnmount(): void {
    this.screenDelegate.clearFetchCategorySuggestions();
  }

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === CategorySelectorScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === CategorySelectorScreenIds.DONE_BTN) {
      Keyboard.dismiss();
      this.props.passedProps.onSelect(
        this.observableScreen.categoryFormState.categoryName === ''
          ? 'Uncategorized'
          : this.observableScreen.categoryFormState.categoryName,
      );
      this.navigatorDelegate.pop();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? CategorySelectorScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : CategorySelectorScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <CategorySelectorScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        screenDelegate={this.screenDelegate}
        observableScreen={this.observableScreen}
      />
    );
  }
}
