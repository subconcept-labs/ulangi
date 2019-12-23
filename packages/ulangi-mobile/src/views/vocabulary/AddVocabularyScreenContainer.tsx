/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { DefinitionBuilder } from '@ulangi/ulangi-common/builders';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableAddEditVocabularyScreen,
  ObservableDefinition,
  ObservableVocabularyFormState,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';
import * as uuid from 'uuid';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { AddVocabularyScreenIds } from '../../constants/ids/AddVocabularyScreenIds';
import { AddVocabularyScreenFactory } from '../../factories/vocabulary/AddVocabularyScreenFactory';
import { AddEditVocabularyScreen } from './AddEditVocabularyScreen';
import { AddVocabularyScreenStyle } from './AddVocabularyScreenContainer.style';

export interface AddVocabularyScreenPassedProps {
  readonly categoryName?: string;
  readonly vocabulary?: Vocabulary;
  readonly closeOnSaveSucceeded: boolean;
}

@observer
export class AddVocabularyScreenContainer extends Container<
  AddVocabularyScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? AddVocabularyScreenStyle.SCREEN_LIGHT_FULL_STYLES
      : AddVocabularyScreenStyle.SCREEN_DARK_FULL_STYLES;
  }

  private screenFactory = new AddVocabularyScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableAddEditVocabularyScreen(
    observable.box('Editor'),
    new ObservableVocabularyFormState(
      typeof this.props.passedProps.vocabulary !== 'undefined'
        ? this.props.passedProps.vocabulary.vocabularyId
        : uuid.v4(),
      typeof this.props.passedProps.vocabulary !== 'undefined'
        ? this.props.passedProps.vocabulary.vocabularyText
        : '',
      observable.array(
        typeof this.props.passedProps.vocabulary !== 'undefined'
          ? this.props.passedProps.vocabulary.definitions.map(
              (definition): ObservableDefinition => {
                return this.props.observableConverter.convertToObservableDefinition(
                  definition,
                );
              },
            )
          : [
              this.props.observableConverter.convertToObservableDefinition(
                new DefinitionBuilder().build({ source: 'N/A' }),
              ),
            ],
      ),
      false,
      null,
      observable.box(null),
      observable.box(null),
      typeof this.props.passedProps.categoryName !== 'undefined'
        ? this.props.passedProps.categoryName
        : typeof this.props.passedProps.vocabulary !== 'undefined' &&
          typeof this.props.passedProps.vocabulary.category !== 'undefined'
        ? this.props.passedProps.vocabulary.category.categoryName
        : 'Uncategorized',
    ),
    ScreenName.ADD_VOCABULARY_SCREEN,
    {
      title: 'Add Vocabulary',
      subtitle: this.props.rootStore.setStore.existingCurrentSet.setName,
      testID: AddVocabularyScreenIds.SHOW_SET_SELECTION_MENU_BTN,
      icon: _.has(
        Images.FLAG_ICONS_BY_LANGUAGE_CODE,
        this.props.rootStore.setStore.existingCurrentSet.learningLanguageCode,
      )
        ? _.get(
            Images.FLAG_ICONS_BY_LANGUAGE_CODE,
            this.props.rootStore.setStore.existingCurrentSet
              .learningLanguageCode,
          )
        : Images.FLAG_ICONS_BY_LANGUAGE_CODE.any,
      onTitlePress: (): void => {
        this.setSelectionMenuDelegate.showActiveSetsForSetSelection();
      },
    },
  );

  private setSelectionMenuDelegate = this.screenFactory.createSetSelectionMenuDelegate();

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === AddVocabularyScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === AddVocabularyScreenIds.SAVE_BTN) {
      Keyboard.dismiss();
      this.screenDelegate.saveAdd(this.props.passedProps.closeOnSaveSucceeded);
    }
  }

  public componentDidMount(): void {
    this.setSelectionMenuDelegate.autoUpdateSubtitleOnSetChange(
      this.observableScreen,
    );
  }

  public componentDidAppear(): void {
    this.observableScreen.vocabularyFormState.shouldFocusVocabularyInput = true;
  }

  public onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? AddVocabularyScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : AddVocabularyScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    const currentSet = this.props.rootStore.setStore.existingCurrentSet;

    return (
      <AddEditVocabularyScreen
        testID={AddVocabularyScreenIds.SCREEN}
        learningLanguage={currentSet.learningLanguage}
        translatedToLanguage={currentSet.translatedToLanguage}
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
