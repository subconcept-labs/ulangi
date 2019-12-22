/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export enum SetExtraDataName {
  SPACED_REPETITION_INITIAL_INTERVAL = 'spacedRepetitionInitialInterval',
  SPACED_REPETITION_MAX_LIMIT = 'spacedRepetitionMaxLimit',
  WRITING_INITIAL_INTERVAL = 'writingInitialInterval',
  WRITING_MAX_LIMIT = 'writingMaxLimit',
  QUIZ_VOCABULARY_POOL = 'quizVocabularyPool',
  QUIZ_MULTIPLE_CHOICE_MAX_LIMIT = 'quizMultipleChoiceMaxLimit',
  QUIZ_WRITING_MAX_LIMIT = 'quizWritingMaxLimit',

  // Depreciate
  SPACED_REPETITION_AUTO_ARCHIVE = 'spacedRepetitionAutoArchive',
  SPACED_REPETITION_LEVEL_THRESHOLD = 'spacedRepetitionLevelThreshold',
  SPACED_REPEITTION_NEXT_TERM_POSITION = 'spacedRepetitionNextTermPosition',
  SPACED_REPETITION_SHOW_DEF_SIDE_EFFECT_STATE = 'spacedRepetitionShowDefSideEffectState',
  WRITING_NEXT_TERM_POSITION = 'writingNextTermPosition',
  WRITING_USE_HINT_SIDE_EFFECT_STATE = 'writingUseHintSideEffectState',
}
