/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { QuizMultipleChoiceMaxLimit } from '../interfaces/general/QuizMultipleChoiceMaxLimit';
import { QuizVocabularyPool } from '../interfaces/general/QuizVocabularyPool';
import { QuizWritingMaxLimit } from '../interfaces/general/QuizWritingMaxLimit';
import { SpacedRepetitionAutoArchive } from '../interfaces/general/SpacedRepetitionAutoArchive';
import { SpacedRepetitionInitialInterval } from '../interfaces/general/SpacedRepetitionInitialInterval';
import { SpacedRepetitionLevelThreshold } from '../interfaces/general/SpacedRepetitionLevelThreshold';
import { SpacedRepetitionMaxLimit } from '../interfaces/general/SpacedRepetitionMaxLimit';
import { SpacedRepetitionNextTermPosition } from '../interfaces/general/SpacedRepetitionNextTermPosition';
import { SpacedRepetitionShowDefSideEffectState } from '../interfaces/general/SpacedRepetitionShowDefSideEffectState';
import { WritingInitialInterval } from '../interfaces/general/WritingInitialInterval';
import { WritingMaxLimit } from '../interfaces/general/WritingMaxLimit';
import { WritingNextTermPosition } from '../interfaces/general/WritingNextTermPosition';
import { WritingUseHintSideEffectState } from '../interfaces/general/WritingUseHintSideEffectState';

export type SetExtraDataItem =
  | SpacedRepetitionInitialInterval
  | SpacedRepetitionMaxLimit
  | SpacedRepetitionShowDefSideEffectState
  | SpacedRepetitionAutoArchive
  | SpacedRepetitionLevelThreshold
  | SpacedRepetitionNextTermPosition
  | WritingInitialInterval
  | WritingMaxLimit
  | WritingUseHintSideEffectState
  | WritingNextTermPosition
  | QuizVocabularyPool
  | QuizMultipleChoiceMaxLimit
  | QuizWritingMaxLimit;
