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
import { SpacedRepetitionAutoArchiveResolver } from './SpacedRepetitionAutoArchiveResolver';
import { SpacedRepetitionInitialIntervalResolver } from './SpacedRepetitionInitialIntervalResolver';
import { SpacedRepetitionLevelThresholdResolver } from './SpacedRepetitionLevelThresholdResolver';
import { SpacedRepetitionMaxLimitResolver } from './SpacedRepetitionMaxLimitResolver';
import { SpacedRepetitionNextTermPositionResolver } from './SpacedRepetitionNextTermPositionResolver';
import { SpacedRepetitionShowDefSideEffectStateResolver } from './SpacedRepetitionShowDefSideEffectStateResolver';
import { WritingInitialIntervalResolver } from './WritingInitialIntervalResolver';
import { WritingMaxLimitResolver } from './WritingMaxLimitResolver';
import { WritingNextTermPositionResolver } from './WritingNextTermPositionResolver';
import { WritingUseHintSideEffectStateResolver } from './WritingUseHintSideEffectStateResolver';

export class SetExtraDataItemResolver extends AbstractAlternativeResolver<
  SetExtraDataItem
> {
  private spacedRepetitionInitialIntervalResolver = new SpacedRepetitionInitialIntervalResolver();
  private spacedRepetitionMaxLimitResolver = new SpacedRepetitionMaxLimitResolver();
  private spacedRepetitionAutoArchiveResolver = new SpacedRepetitionAutoArchiveResolver();
  private spacedRepetitionLevelThresholdResolver = new SpacedRepetitionLevelThresholdResolver();
  private spacedRepetitionNextTermPositionResolver = new SpacedRepetitionNextTermPositionResolver();
  private SpacedRepetitionShowDefSideEffectStateResolver = new SpacedRepetitionShowDefSideEffectStateResolver();
  private writingInitialIntervalResolver = new WritingInitialIntervalResolver();
  private writingMaxLimitResolver = new WritingMaxLimitResolver();
  private WritingUseHintSideEffectStateResolver = new WritingUseHintSideEffectStateResolver();
  private WritingNextTermPositionResolver = new WritingNextTermPositionResolver();
  private quizVocabularyPoolResolver = new QuizVocabularyPoolResolver();
  private quizWritingMaxLimitResolver = new QuizWritingMaxLimitResolver();
  private quizMultipleChoiceMaxLimitResolver = new QuizMultipleChoiceMaxLimitResolver();

  protected rules: Joi.AlternativesSchema;

  public constructor() {
    super();
    this.rules = Joi.alternatives().try(
      this.spacedRepetitionInitialIntervalResolver.getRules(),
      this.spacedRepetitionMaxLimitResolver.getRules(),
      this.spacedRepetitionAutoArchiveResolver.getRules(),
      this.spacedRepetitionLevelThresholdResolver.getRules(),
      this.spacedRepetitionNextTermPositionResolver.getRules(),
      this.SpacedRepetitionShowDefSideEffectStateResolver.getRules(),
      this.writingInitialIntervalResolver.getRules(),
      this.WritingNextTermPositionResolver.getRules(),
      this.WritingUseHintSideEffectStateResolver.getRules(),
      this.writingMaxLimitResolver.getRules(),
      this.quizVocabularyPoolResolver.getRules(),
      this.quizWritingMaxLimitResolver.getRules(),
      this.quizMultipleChoiceMaxLimitResolver.getRules()
    );
  }
}
