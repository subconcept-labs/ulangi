/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepMutable, DeepPartial } from '@ulangi/extended-types';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { DefinitionStatus, ErrorCode } from '@ulangi/ulangi-common/enums';
import { Definition, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableVocabulary,
  ObservableVocabularyFormState,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

export class EditVocabularyDelegate {
  private eventBus: EventBus;
  private observableConverter: ObservableConverter;
  private originalEditingVocabulary: Vocabulary;
  private vocabularyFormState: ObservableVocabularyFormState;

  public constructor(
    eventBus: EventBus,
    observableConverter: ObservableConverter,
    originalEditingVocabulary: Vocabulary,
    vocabularyFormState: ObservableVocabularyFormState,
  ) {
    this.eventBus = eventBus;
    this.observableConverter = observableConverter;
    this.originalEditingVocabulary = originalEditingVocabulary;
    this.vocabularyFormState = vocabularyFormState;
  }

  public saveEdit(callback: {
    onSaving: () => void;
    onSaveSucceeded: () => void;
    onSaveFailed: (errorCode: string) => void;
  }): void {
    if (this.vocabularyFormState.areAllDefinitionsEmpty) {
      callback.onSaveFailed(ErrorCode.VOCABULARY__NO_DEFINITIONS);
    } else {
      const changes = this.getChanges();

      this.eventBus.pubsub(
        createAction(ActionType.VOCABULARY__EDIT, {
          vocabulary: {
            vocabularyId: this.originalEditingVocabulary.vocabularyId,
            ...changes,
          },
          setId: undefined,
        }),
        group(
          on(ActionType.VOCABULARY__EDITING, callback.onSaving),
          once(ActionType.VOCABULARY__EDIT_SUCCEEDED, callback.onSaveSucceeded),
          once(
            ActionType.VOCABULARY__EDIT_FAILED,
            ({ errorCode }): void => callback.onSaveFailed(errorCode),
          ),
        ),
      );
    }
  }

  public createPreview(): ObservableVocabulary {
    const vocabulary = this.applyChanges(this.getChanges());

    return this.observableConverter.convertToObservableVocabulary({
      ...vocabulary,
      definitions: vocabulary.definitions.filter(
        (definition): boolean => {
          return definition.definitionStatus !== DefinitionStatus.DELETED;
        },
      ),
    });
  }

  private applyChanges(changes: DeepPartial<Vocabulary>): Vocabulary {
    return _.mergeWith(
      {}, // Avoid mutating object
      this.originalEditingVocabulary,
      changes,
      (original, edited, key): undefined | Definition[] => {
        if (key === 'definitions') {
          // Merge definitions by definitionId
          const merged = _.merge(
            {},
            _.keyBy(original, 'definitionId'),
            _.keyBy(edited, 'definitionId'),
          );
          return _.values(merged);
        }
      },
    );
  }

  private getChanges(): DeepPartial<Vocabulary> {
    const removedDefinitions = this.getRemovedDefinitions(
      this.originalEditingVocabulary,
    );

    const editedVocabulary: DeepPartial<Vocabulary> = {
      vocabularyText: this.vocabularyFormState.vocabularyText,
      definitions: _.concat(
        removedDefinitions.map(
          (definition): DeepPartial<Definition> => {
            return {
              definitionId: definition.definitionId,
              definitionStatus: DefinitionStatus.DELETED,
            };
          },
        ),
        this.vocabularyFormState.definitions
          .filter((definition): boolean => definition.meaning !== '')
          .map((definition): Definition => definition.toRaw()),
      ),
      category: {
        categoryName:
          this.vocabularyFormState.categoryName === ''
            ? 'Uncategorized'
            : this.vocabularyFormState.categoryName,
      },
    };

    return this.getVocabularyDiff(
      this.originalEditingVocabulary,
      editedVocabulary,
    );
  }

  private getRemovedDefinitions(
    originalEditingVocabulary: Vocabulary,
  ): readonly Definition[] {
    const originalDefinitions = originalEditingVocabulary.definitions;

    const currentDefinitions = this.vocabularyFormState.definitions;

    // Get those that exist in the original list but not in the current list
    return originalDefinitions.filter(
      (originDefinition): boolean => {
        const currentDefinition = currentDefinitions.find(
          (definition): boolean =>
            definition.definitionId === originDefinition.definitionId,
        );

        return (
          typeof currentDefinition === 'undefined' ||
          currentDefinition.meaning === ''
        );
      },
    );
  }

  // Get the diff of the vocabulary including new diffitions
  private getVocabularyDiff(
    originalVocabulary: Vocabulary,
    editedVocabulary: DeepPartial<Vocabulary>,
  ): DeepPartial<Vocabulary> {
    const diff: DeepMutable<DeepPartial<Vocabulary>> = {};

    for (let key in editedVocabulary) {
      if (editedVocabulary.hasOwnProperty(key)) {
        if (key === 'definitions') {
          const editedDefinitions = editedVocabulary[key];
          if (typeof editedDefinitions !== 'undefined') {
            diff.definitions = editedDefinitions.map(
              (editedDefinition): DeepPartial<Definition> => {
                const originalDefinition = originalVocabulary.definitions.find(
                  (definition): boolean =>
                    definition.definitionId === editedDefinition.definitionId,
                );

                if (typeof originalDefinition !== 'undefined') {
                  return {
                    definitionId: originalDefinition.definitionId,
                    ...this.getDefinitionDiff(
                      originalDefinition,
                      editedDefinition,
                    ),
                  };
                } else {
                  return editedDefinition;
                }
              },
            );
          }
        } else if (key === 'category') {
          const editedCategory = editedVocabulary[key];
          const originalCategory = originalVocabulary[key];
          if (typeof editedCategory !== 'undefined') {
            if (typeof originalCategory !== 'undefined') {
              if (
                editedCategory.categoryName !== originalCategory.categoryName
              ) {
                diff[key] = {
                  categoryName: editedCategory.categoryName,
                };
              }
            } else {
              diff[key] = {
                categoryName: editedCategory.categoryName,
              };
            }
          }
        } else if (key === 'vocabularyText') {
          const editedVocabularyText = editedVocabulary[key];
          if (editedVocabularyText !== originalVocabulary[key]) {
            diff[key] = editedVocabularyText;
          }
        } else if (
          _.get(editedVocabulary, key) !== _.get(originalVocabulary, key)
        ) {
          const editedValue = _.get(editedVocabulary, key);
          _.set(diff, key, editedValue);
        }
      }
    }

    return diff;
  }

  private getDefinitionDiff(
    originalDefinition: Definition,
    editedDefinition: DeepPartial<Definition>,
  ): DeepPartial<Definition> {
    const diff: DeepMutable<DeepPartial<Definition>> = {};

    for (let key in editedDefinition) {
      if (editedDefinition.hasOwnProperty(key)) {
        if (key === 'wordClasses') {
          const editedWordClasses = editedDefinition[key];
          if (
            typeof editedWordClasses !== 'undefined' &&
            _.xor(editedWordClasses, originalDefinition[key]).length > 0
          ) {
            diff[key] = [];
          }
        } else if (
          _.get(editedDefinition, key) !== _.get(originalDefinition, key)
        ) {
          const editedValue = _.get(editedDefinition, key);
          _.set(diff, key, editedValue);
        }
      }
    }

    return diff;
  }
}
