/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { QuizMultipleChoiceMaxLimit } from '../interfaces/general/QuizMultipleChoiceMaxLimit';
import { QuizVocabularyPool } from '../interfaces/general/QuizVocabularyPool';
import { QuizWritingAutoShowKeyboard } from '../interfaces/general/QuizWritingAutoShowKeyboard';
import { QuizWritingHighlightOnError } from '../interfaces/general/QuizWritingHighlightOnError';
import { QuizWritingMaxLimit } from '../interfaces/general/QuizWritingMaxLimit';
import { SetFeatureSettings } from '../interfaces/general/SetFeatureSettings';
import { SpacedRepetitionAutoplayAudio } from '../interfaces/general/SpacedRepetitionAutoplayAudio';
import { SpacedRepetitionFeedbackButtons } from '../interfaces/general/SpacedRepetitionFeedbackButtons';
import { SpacedRepetitionInitialInterval } from '../interfaces/general/SpacedRepetitionInitialInterval';
import { SpacedRepetitionMaxLimit } from '../interfaces/general/SpacedRepetitionMaxLimit';
import { SpacedRepetitionReviewPriority } from '../interfaces/general/SpacedRepetitionReviewPriority';
import { SpacedRepetitionReviewStrategy } from '../interfaces/general/SpacedRepetitionReviewStrategy';
import { WritingAutoShowKeyboard } from '../interfaces/general/WritingAutoShowKeyboard';
import { WritingAutoplayAudio } from '../interfaces/general/WritingAutoplayAudio';
import { WritingFeedbackButtons } from '../interfaces/general/WritingFeedbackButtons';
import { WritingHighlightOnError } from '../interfaces/general/WritingHighlightOnError';
import { WritingInitialInterval } from '../interfaces/general/WritingInitialInterval';
import { WritingMaxLimit } from '../interfaces/general/WritingMaxLimit';
import { WritingReviewPriority } from '../interfaces/general/WritingReviewPriority';

export type SetExtraDataItem =
  | SetFeatureSettings
  | SpacedRepetitionAutoplayAudio
  | SpacedRepetitionInitialInterval
  | SpacedRepetitionMaxLimit
  | SpacedRepetitionReviewStrategy
  | SpacedRepetitionReviewPriority
  | SpacedRepetitionFeedbackButtons
  | WritingAutoplayAudio
  | WritingInitialInterval
  | WritingMaxLimit
  | WritingFeedbackButtons
  | WritingAutoShowKeyboard
  | WritingHighlightOnError
  | WritingReviewPriority
  | QuizVocabularyPool
  | QuizMultipleChoiceMaxLimit
  | QuizWritingMaxLimit
  | QuizWritingAutoShowKeyboard
  | QuizWritingHighlightOnError;
