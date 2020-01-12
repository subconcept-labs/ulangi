/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { QuizMultipleChoiceMaxLimit } from '../interfaces/general/QuizMultipleChoiceMaxLimit';
import { QuizVocabularyPool } from '../interfaces/general/QuizVocabularyPool';
import { QuizWritingMaxLimit } from '../interfaces/general/QuizWritingMaxLimit';
import { SpacedRepetitionInitialInterval } from '../interfaces/general/SpacedRepetitionInitialInterval';
import { SpacedRepetitionMaxLimit } from '../interfaces/general/SpacedRepetitionMaxLimit';
import { SpacedRepetitionReviewStrategy } from '../interfaces/general/SpacedRepetitionReviewStrategy';
import { WritingInitialInterval } from '../interfaces/general/WritingInitialInterval';
import { WritingMaxLimit } from '../interfaces/general/WritingMaxLimit';

export type SetExtraDataItem =
  | SpacedRepetitionInitialInterval
  | SpacedRepetitionMaxLimit
  | SpacedRepetitionReviewStrategy
  | WritingInitialInterval
  | WritingMaxLimit
  | QuizVocabularyPool
  | QuizMultipleChoiceMaxLimit
  | QuizWritingMaxLimit;
