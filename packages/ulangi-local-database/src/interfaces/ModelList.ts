/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { CategoryModel } from '../models/CategoryModel';
import { DefinitionModel } from '../models/DefinitionModel';
import { DirtyDefinitionModel } from '../models/DirtyDefinitionModel';
import { DirtySetExtraDataModel } from '../models/DirtySetExtraDataModel';
import { DirtySetModel } from '../models/DirtySetModel';
import { DirtyUserExtraDataModel } from '../models/DirtyUserExtraDataModel';
import { DirtyUserModel } from '../models/DirtyUserModel';
import { DirtyVocabularyCategoryModel } from '../models/DirtyVocabularyCategoryModel';
import { DirtyVocabularyModel } from '../models/DirtyVocabularyModel';
import { DirtyVocabularyWritingModel } from '../models/DirtyVocabularyWritingModel';
import { IncompatibleSetModel } from '../models/IncompatibleSetModel';
import { IncompatibleVocabularyModel } from '../models/IncompatibleVocabularyModel';
import { QuizMultipleChoiceModel } from '../models/QuizMultipleChoiceModel';
import { QuizWritingModel } from '../models/QuizWritingModel';
import { RemoteConfigModel } from '../models/RemoteConfigModel';
import { SessionModel } from '../models/SessionModel';
import { SetExtraDataModel } from '../models/SetExtraDataModel';
import { SetModel } from '../models/SetModel';
import { SpacedRepetitionModel } from '../models/SpacedRepetitionModel';
import { UserExtraDataModel } from '../models/UserExtraDataModel';
import { UserModel } from '../models/UserModel';
import { VocabularyCategoryModel } from '../models/VocabularyCategoryModel';
import { VocabularyLocalDataModel } from '../models/VocabularyLocalDataModel';
import { VocabularyModel } from '../models/VocabularyModel';
import { VocabularyWritingModel } from '../models/VocabularyWritingModel';
import { WritingModel } from '../models/WritingModel';

export interface ModelList {
  readonly userModel: UserModel;
  readonly userExtraDataModel: UserExtraDataModel;
  readonly setModel: SetModel;
  readonly setExtraDataModel: SetExtraDataModel;
  readonly categoryModel: CategoryModel;
  readonly vocabularyModel: VocabularyModel;
  readonly vocabularyCategoryModel: VocabularyCategoryModel;
  readonly vocabularyLocalDataModel: VocabularyLocalDataModel;
  readonly vocabularyWritingModel: VocabularyWritingModel;
  readonly definitionModel: DefinitionModel;
  readonly spacedRepetitionModel: SpacedRepetitionModel;
  readonly writingModel: WritingModel;
  readonly quizMultipleChoiceModel: QuizMultipleChoiceModel;
  readonly quizWritingModel: QuizWritingModel;
  readonly remoteConfigModel: RemoteConfigModel;
  readonly sessionModel: SessionModel;
  readonly dirtyDefinitionModel: DirtyDefinitionModel;
  readonly dirtyVocabularyModel: DirtyVocabularyModel;
  readonly dirtyVocabularyCategoryModel: DirtyVocabularyCategoryModel;
  readonly dirtyVocabularyWritingModel: DirtyVocabularyWritingModel;
  readonly dirtyUserExtraDataModel: DirtyUserExtraDataModel;
  readonly dirtyUserModel: DirtyUserModel;
  readonly dirtySetExtraDataModel: DirtySetExtraDataModel;
  readonly dirtySetModel: DirtySetModel;
  readonly incompatibleSetModel: IncompatibleSetModel;
  readonly incompatibleVocabularyModel: IncompatibleVocabularyModel;
}
