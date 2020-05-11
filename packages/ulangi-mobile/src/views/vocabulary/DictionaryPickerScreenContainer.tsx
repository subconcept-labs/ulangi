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
  ObservableDictionaryEntryState,
  ObservableDictionaryPickerScreen,
  ObservableTranslationListState,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { DictionaryPickerScreenFactory } from '../../factories/vocabulary/DictionaryPickerScreenFactory';
import { DictionaryPickerScreen } from './DictionaryPickerScreen';

export interface DictionaryPickerScreenPassedProps {
  readonly currentTerm: string;
  readonly onPick: (definition: DeepPartial<Definition>) => void;
}

@observer
export class DictionaryPickerScreenContainer extends Container<
  DictionaryPickerScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    if (props.theme === Theme.LIGHT) {
      return props.styles ? props.styles.light : {};
    } else {
      return props.styles ? props.styles.dark : {};
    }
  }

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableDictionaryPickerScreen(
    this.props.passedProps.currentTerm,
    new ObservableDictionaryEntryState(
      null,
      null,
      null,
      observable.box(ActivityState.INACTIVE),
      observable.box(undefined),
    ),
    new ObservableTranslationListState(
      null,
      null,
      observable.box(ActivityState.INACTIVE),
      observable.box(undefined),
      observable.box(false),
    ),
    this.props.componentId,
    ScreenName.DICTIONARY_PICKER_SCREEN,
  );

  private screenFactory = new DictionaryPickerScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.getDictionaryEntry();
  }

  public componentWillUnmount(): void {
    this.screenDelegate.clearDictionaryEntry();
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
      <DictionaryPickerScreen
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
