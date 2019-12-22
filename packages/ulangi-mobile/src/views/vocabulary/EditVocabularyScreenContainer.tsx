/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableDefinition,
  ObservableEditVocabularyScreen,
  ObservableVocabularyFormState,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { EditVocabularyScreenIds } from '../../constants/ids/EditVocabularyScreenIds';
import { EditVocabularyScreenFactory } from '../../factories/vocabulary/EditVocabularyScreenFactory';
import { AddEditVocabularyScreen } from './AddEditVocabularyScreen';
import { EditVocabularyScreenStyle } from './EditVocabularyScreenContainer.style';

export interface EditVocabularyScreenPassedProps {
  readonly originalVocabulary: Vocabulary;
}

@observer
export class EditVocabularyScreenContainer extends Container<
  EditVocabularyScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? EditVocabularyScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : EditVocabularyScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new EditVocabularyScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private definitionDelegate = this.screenFactory.createDefinitionDelegate();

  protected observableScreen = new ObservableEditVocabularyScreen(
    this.props.passedProps.originalVocabulary,
    observable.box('Editor'),
    new ObservableVocabularyFormState(
      this.props.passedProps.originalVocabulary.vocabularyId,
      this.props.passedProps.originalVocabulary.vocabularyText,
      observable.array(
        this.props.passedProps.originalVocabulary.definitions.map(
          (definition): ObservableDefinition => {
            return this.props.observableConverter.convertToObservableDefinition(
              {
                ...definition,
                meaning: this.definitionDelegate.prependBuiltInWordClassesToMeaning(
                  definition.meaning,
                  definition.wordClasses
                ),
                // Remove all built-in wordClasses
                wordClasses: [],
              }
            );
          }
        )
      ),
      false,
      null,
      observable.box(null),
      observable.box(null),
      _.get(
        this.props.passedProps.originalVocabulary.category,
        'categoryName'
      ) || 'Uncategorized'
    ),
    ScreenName.EDIT_VOCABULARY_SCREEN
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === EditVocabularyScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === EditVocabularyScreenIds.SAVE_BTN) {
      Keyboard.dismiss();
      this.screenDelegate.saveEdit();
    }
  }

  public onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? EditVocabularyScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : EditVocabularyScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    const currentSet = this.props.rootStore.setStore.existingCurrentSet;

    return (
      <AddEditVocabularyScreen
        testID={EditVocabularyScreenIds.SCREEN}
        learningLanguage={currentSet.learningLanguage}
        translatedToLanguage={currentSet.translatedToLanguage}
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
