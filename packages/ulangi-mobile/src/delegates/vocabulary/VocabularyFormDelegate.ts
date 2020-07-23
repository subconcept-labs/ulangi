/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { DefinitionBuilder } from '@ulangi/ulangi-common/builders';
import { ButtonSize, ScreenName } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableConverter,
  ObservableKeyboard,
  ObservableLightBox,
  ObservableVocabularyFormState,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { when } from 'mobx';
import { Keyboard, Platform } from 'react-native';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { DefinitionDelegate } from './DefinitionDelegate';

export class VocabularyFormDelegate {
  private definitionBuilder = new DefinitionBuilder();

  private observableLightBox: ObservableLightBox;
  private observableKeyboard: ObservableKeyboard;
  private observableConverter: ObservableConverter;
  private vocabularyFormState: ObservableVocabularyFormState;
  private definitionDelegate: DefinitionDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableLightBox: ObservableLightBox,
    observableKeyboard: ObservableKeyboard,
    observableConverter: ObservableConverter,
    vocabularyFormState: ObservableVocabularyFormState,
    definitionDelegate: DefinitionDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableLightBox = observableLightBox;
    this.observableKeyboard = observableKeyboard;
    this.observableConverter = observableConverter;
    this.vocabularyFormState = vocabularyFormState;
    this.definitionDelegate = definitionDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public addDefinitionSlot(): void {
    this.vocabularyFormState.definitions.push(
      this.observableConverter.convertToObservableDefinition(
        this.definitionBuilder.build({ source: 'N/A' }),
      ),
    );
  }

  public addDefinition(definition: DeepPartial<Definition>): void {
    if (
      typeof definition.wordClasses !== 'undefined' &&
      typeof definition.meaning !== 'undefined'
    ) {
      const meaning = !this.definitionDelegate.hasCustomWordClasses(
        definition.meaning,
      )
        ? this.definitionDelegate.prependBuiltInWordClassesToMeaning(
            definition.meaning,
            definition.wordClasses,
          )
        : definition.meaning;

      definition = { ...definition, meaning };
    }

    const lastDefinition = assertExists(
      _.last(this.vocabularyFormState.definitions),
      'lastDefintion should not be null or undefined',
    );

    // If the meaning is empty, merge definition to the last one
    if (lastDefinition.meaning === '') {
      this.vocabularyFormState.definitions[
        this.vocabularyFormState.definitions.length - 1
      ] = this.observableConverter.convertToObservableDefinition(
        this.definitionBuilder.build({
          ...definition,
          definitionId: lastDefinition.definitionId,
        }),
      );
    }
    // If the meaning is not empty, then add new slot
    else {
      this.vocabularyFormState.definitions.push(
        this.observableConverter.convertToObservableDefinition(
          this.definitionBuilder.build(definition),
        ),
      );
    }
  }

  public deleteDefinition(index: number): void {
    // If only 1 definition left, then reset it
    if (this.vocabularyFormState.definitions.length === 1) {
      this.vocabularyFormState.setDefinitions([
        this.observableConverter.convertToObservableDefinition(
          this.definitionBuilder.build({ source: 'N/A' }),
        ),
      ]);
    } else {
      // delete it by index
      this.vocabularyFormState.definitions.splice(index, 1);
    }
  }

  public showConfirmDeleteDefinition(index: number): void {
    Keyboard.dismiss();
    this.dialogDelegate.show({
      message: 'Are you sure you want to delete this definition?',
      onBackgroundPress: (): void => {
        this.dialogDelegate.dismiss();
      },
      buttonList: [
        {
          testID: VocabularyFormIds.CANCEL_BTN,
          text: 'CANCEL',
          onPress: (): void => {
            this.dialogDelegate.dismiss();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
        {
          testID: VocabularyFormIds.DELETE_BTN,
          text: 'DELETE',
          onPress: (): void => {
            this.deleteDefinition(index);
            this.dialogDelegate.dismiss();
          },
          styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
      ],
    });
  }

  public lookUp(): void {
    Keyboard.dismiss();
    if (this.vocabularyFormState.vocabularyTerm === '') {
      this.dialogDelegate.show({
        message: 'To look up dictionary, please enter the term first.',
        showCloseButton: true,
        closeOnTouchOutside: true,
      });
    } else {
      this.navigatorDelegate.showLightBox(
        ScreenName.DICTIONARY_PICKER_SCREEN,
        {
          currentTerm: this.vocabularyFormState.vocabularyTerm,
          onPick: (definition): void => this.addDefinition(definition),
        },
        SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
      );
    }
  }

  public showSuggestions(): void {
    Keyboard.dismiss();
    if (this.vocabularyFormState.vocabularyTerm === '') {
      this.dialogDelegate.show({
        message: 'To see suggestions, please enter the term first.',
        showCloseButton: true,
        closeOnTouchOutside: true,
      });
    } else {
      this.navigatorDelegate.showLightBox(
        ScreenName.SUGGESTIONS_PICKER_SCREEN,
        {
          currentVocabularyText: this.vocabularyFormState.vocabularyText,
          onSelect: (fieldName, value): string => {
            this.vocabularyFormState.vocabularyText +=
              '\n' + `[${fieldName}: ${value}]`;
            return this.vocabularyFormState.vocabularyText;
          },
        },
        SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
      );
    }
  }

  public showVocabularyExtraFieldsPicker(): void {
    Keyboard.dismiss();
    this.navigatorDelegate.showLightBox(
      ScreenName.EXTRA_FIELDS_PICKER_SCREEN,
      {
        kind: 'vocabulary',
        selectImages: _.noop,
        onPick: (extraField, value, cursor): void =>
          this.addExtraFieldForTerm(extraField.parseDirection, value, cursor),
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public showDefinitionExtraFieldsPicker(index: number): void {
    Keyboard.dismiss();
    this.navigatorDelegate.showLightBox(
      ScreenName.EXTRA_FIELDS_PICKER_SCREEN,
      {
        kind: 'definition',
        selectImages: (): void => {
          const definition = this.vocabularyFormState.definitions[index];
          if (definition.plainMeaning === '') {
            this.navigatorDelegate.dismissLightBox();
            when(
              (): boolean => this.observableLightBox.state === 'unmounted',
              (): void => {
                this.dialogDelegate.show({
                  message: 'Please enter the definition first.',
                  showCloseButton: true,
                });
              },
            );
          } else {
            this.selectImages(index);
          }
        },
        onPick: (extraField, value, cursor): void =>
          this.addExtraFieldForDefinition(
            index,
            extraField.parseDirection,
            value,
            cursor,
          ),
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public editCategory(): void {
    Keyboard.dismiss();
    when(
      (): boolean => this.observableKeyboard.state === 'hidden',
      (): void => {
        this.navigatorDelegate.push(ScreenName.CATEGORY_SELECTOR_SCREEN, {
          initialCategoryName: undefined,
          onSelect: (categoryName): void => {
            this.vocabularyFormState.categoryName = categoryName;
          },
        });
      },
    );
  }

  public selectImages(index: number): void {
    this.navigatorDelegate.dismissLightBox();
    this.navigatorDelegate.push(ScreenName.IMAGE_SELECTOR_SCREEN, {
      onSelect: (urls: string[]): void => {
        this.addExtraFieldForDefinition(
          index,
          'right',
          urls.map((url): string => `[image: ${url}]`).join('\n'),
          undefined,
        );
      },
    });
  }

  private addExtraFieldForTerm(
    position: 'left' | 'right',
    value: string,
    cursor: undefined | number,
  ): void {
    const currentText = this.vocabularyFormState.vocabularyText;

    if (
      position === 'right' &&
      this.vocabularyFormState.vocabularyTerm === ''
    ) {
      this.navigatorDelegate.dismissLightBox();
      when(
        (): boolean => this.observableLightBox.state === 'unmounted',
        (): void => {
          this.dialogDelegate.show({
            message:
              'This extra field must be added after the term. Please enter the term first.',
            showCloseButton: true,
          });
        },
      );
    } else {
      if (position === 'left') {
        this.vocabularyFormState.vocabularyText = currentText.startsWith(' ')
          ? value + currentText
          : value + ' ' + currentText;

        if (typeof cursor !== 'undefined') {
          this.navigatorDelegate.dismissLightBox();

          if (Platform.OS === 'ios') {
            this.vocabularyFormState.shouldFocusVocabularyInput = true;
            _.delay((): void => {
              const cursorPosition = cursor;
              this.vocabularyFormState.shouldMoveCursorOfVocabularyInput = cursorPosition;
            }, 200);
          }
        }
      } else {
        const preparedText = currentText.endsWith('\n')
          ? this.vocabularyFormState.vocabularyText
          : this.vocabularyFormState.vocabularyText + '\n';

        this.vocabularyFormState.vocabularyText = preparedText + value;

        if (typeof cursor !== 'undefined') {
          this.navigatorDelegate.dismissLightBox();

          if (Platform.OS === 'ios') {
            this.vocabularyFormState.shouldFocusVocabularyInput = true;

            _.delay((): void => {
              const cursorPosition = preparedText.length + cursor;
              this.vocabularyFormState.shouldMoveCursorOfVocabularyInput = cursorPosition;
            }, 200);
          }
        }
      }
    }
  }

  private addExtraFieldForDefinition(
    index: number,
    position: 'left' | 'right',
    value: string,
    cursor: undefined | number,
  ): void {
    const currentDefinition = this.vocabularyFormState.definitions[index];
    if (position === 'right' && currentDefinition.plainMeaning === '') {
      this.navigatorDelegate.dismissLightBox();
      when(
        (): boolean => this.observableLightBox.state === 'unmounted',
        (): void => {
          this.dialogDelegate.show({
            message:
              'This extra field must be added after the definition. Please enter the definition first.',
            showCloseButton: true,
          });
        },
      );
    } else {
      if (position === 'left') {
        currentDefinition.meaning = currentDefinition.meaning.startsWith(' ')
          ? value + currentDefinition.meaning
          : value + ' ' + currentDefinition.meaning;

        if (typeof cursor !== 'undefined') {
          this.navigatorDelegate.dismissLightBox();

          if (Platform.OS === 'ios') {
            this.vocabularyFormState.shouldFocusDefinitionInput.set(index);
            _.delay((): void => {
              const cursorPosition = cursor;
              this.vocabularyFormState.shouldMoveCursorOfDefinitionInput.set({
                index,
                position: cursorPosition,
              });
            }, 200);
          }
        }
      } else {
        const preparedMeaning = currentDefinition.meaning.endsWith('\n')
          ? currentDefinition.meaning
          : currentDefinition.meaning + '\n';

        currentDefinition.meaning = preparedMeaning + value;

        if (typeof cursor !== 'undefined') {
          this.navigatorDelegate.dismissLightBox();

          if (Platform.OS === 'ios') {
            this.vocabularyFormState.shouldFocusDefinitionInput.set(index);
            _.delay((): void => {
              const cursorPosition = preparedMeaning.length + cursor;
              this.vocabularyFormState.shouldMoveCursorOfDefinitionInput.set({
                index,
                position: cursorPosition,
              });
            }, 200);
          }
        }
      }
    }
  }
}
