/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableSuggestionListState,
  ObservableSuggestionsPickerScreen,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { SuggestionsPickerScreenFactory } from '../../factories/vocabulary/SuggestionsPickerScreenFactory';
import { SuggestionsPickerScreen } from './SuggestionsPickerScreen';

export interface SuggestionsPickerScreenPassedProps {
  readonly currentVocabularyText: string;
  readonly onPick: (definition: DeepPartial<Definition>) => void;
}

@observer
export class SuggestionsPickerScreenContainer extends Container<
  SuggestionsPickerScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    if (props.theme === Theme.LIGHT) {
      return props.styles ? props.styles.light : {};
    } else {
      return props.styles ? props.styles.dark : {};
    }
  }

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableSuggestionsPickerScreen(
    this.props.passedProps.currentVocabularyText,
    new ObservableSuggestionListState(
      null,
      null,
      observable.box(ActivityState.INACTIVE),
      observable.box(undefined),
    ),
    this.props.componentId,
    ScreenName.SUGGESTIONS_PICKER_SCREEN,
  );

  private screenFactory = new SuggestionsPickerScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.getSuggestionsEntry();
  }

  public componentWillUnmount(): void {
    this.screenDelegate.clearSuggestionsEntry();
    this.screenDelegate.clearTranslations();
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? this.props.styles
          ? this.props.styles.light
          : {}
        : this.props.styles
        ? this.props.styles.dark
        : {},
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SuggestionsPickerScreen
        observableLightBox={this.props.observableLightBox}
        observableScreen={this.observableScreen}
        themeStore={this.props.rootStore.themeStore}
        setStore={this.props.rootStore.setStore}
        screenDelegate={this.screenDelegate}
        onPick={this.props.passedProps.onPick}
      />
    );
  }
}
