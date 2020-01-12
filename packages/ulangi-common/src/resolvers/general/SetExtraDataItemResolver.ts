/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractAlternativeResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SetExtraDataItem } from '../../types/SetExtraDataItem';
import { QuizMultipleChoiceMaxLimitResolver } from './QuizMultipleChoiceMaxLimitResolver';
import { QuizVocabularyPoolResolver } from './QuizVocabularyPoolResolver';
import { QuizWritingMaxLimitResolver } from './QuizWritingMaxLimitResolver';
import { SpacedRepetitionInitialIntervalResolver } from './SpacedRepetitionInitialIntervalResolver';
import { SpacedRepetitionMaxLimitResolver } from './SpacedRepetitionMaxLimitResolver';
import { SpacedRepetitionReviewStrategyResolver } from './SpacedRepetitionReviewStrategyResolver';
import { WritingInitialIntervalResolver } from './WritingInitialIntervalResolver';
import { WritingMaxLimitResolver } from './WritingMaxLimitResolver';

export class SetExtraDataItemResolver extends AbstractAlternativeResolver<
  SetExtraDataItem
> {
  private spacedRepetitionInitialIntervalResolver = new SpacedRepetitionInitialIntervalResolver();
  private spacedRepetitionMaxLimitResolver = new SpacedRepetitionMaxLimitResolver();
  private spacedRepetitionReviewStrategyResolver = new SpacedRepetitionReviewStrategyResolver();
  private writingInitialIntervalResolver = new WritingInitialIntervalResolver();
  private writingMaxLimitResolver = new WritingMaxLimitResolver();
  private quizVocabularyPoolResolver = new QuizVocabularyPoolResolver();
  private quizWritingMaxLimitResolver = new QuizWritingMaxLimitResolver();
  private quizMultipleChoiceMaxLimitResolver = new QuizMultipleChoiceMaxLimitResolver();

  protected rules: Joi.AlternativesSchema;

  public constructor() {
    super();
    this.rules = Joi.alternatives().try(
      this.spacedRepetitionInitialIntervalResolver.getRules(),
      this.spacedRepetitionMaxLimitResolver.getRules(),
      this.spacedRepetitionReviewStrategyResolver.getRules(),
      this.writingInitialIntervalResolver.getRules(),
      this.writingMaxLimitResolver.getRules(),
      this.quizVocabularyPoolResolver.getRules(),
      this.quizWritingMaxLimitResolver.getRules(),
      this.quizMultipleChoiceMaxLimitResolver.getRules()
    );
  }
}
