/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { ModelList } from '../interfaces/ModelList';
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

export class ModelFactory {
  private databaseEventBus: DatabaseEventBus;

  public constructor(databaseEventBus: DatabaseEventBus) {
    this.databaseEventBus = databaseEventBus;
  }

  public createAllModels(): ModelList {
    return {
      userModel: this.createModel('userModel'),
      userExtraDataModel: this.createModel('userExtraDataModel'),
      setModel: this.createModel('setModel'),
      setExtraDataModel: this.createModel('setExtraDataModel'),
      vocabularyCategoryModel: this.createModel('vocabularyCategoryModel'),
      vocabularyLocalDataModel: this.createModel('vocabularyLocalDataModel'),
      vocabularyWritingModel: this.createModel('vocabularyWritingModel'),
      categoryModel: this.createModel('categoryModel'),
      definitionModel: this.createModel('definitionModel'),
      vocabularyModel: this.createModel('vocabularyModel'),
      spacedRepetitionModel: this.createModel('spacedRepetitionModel'),
      writingModel: this.createModel('writingModel'),
      quizMultipleChoiceModel: this.createModel('quizMultipleChoiceModel'),
      quizWritingModel: this.createModel('quizWritingModel'),
      sessionModel: this.createModel('sessionModel'),
      remoteConfigModel: this.createModel('remoteConfigModel'),
      dirtyDefinitionModel: this.createModel('dirtyDefinitionModel'),
      dirtyVocabularyModel: this.createModel('dirtyVocabularyModel'),
      dirtyVocabularyCategoryModel: this.createModel(
        'dirtyVocabularyCategoryModel'
      ),
      dirtyVocabularyWritingModel: this.createModel(
        'dirtyVocabularyWritingModel'
      ),
      dirtyUserModel: this.createModel('dirtyUserModel'),
      dirtyUserExtraDataModel: this.createModel('dirtyUserExtraDataModel'),
      dirtySetModel: this.createModel('dirtySetModel'),
      dirtySetExtraDataModel: this.createModel('dirtySetExtraDataModel'),
      incompatibleSetModel: this.createModel('incompatibleSetModel'),
      incompatibleVocabularyModel: this.createModel(
        'incompatibleVocabularyModel'
      ),
    };
  }

  public createModel<K extends keyof ModelList>(modelName: K): ModelList[K] {
    let model;
    if (modelName === 'userModel') {
      model = new UserModel(
        this.createModel('userExtraDataModel'),
        this.createModel('dirtyUserModel'),
        this.databaseEventBus
      );
    } else if (modelName === 'userExtraDataModel') {
      model = new UserExtraDataModel();
    } else if (modelName === 'setModel') {
      model = new SetModel(
        this.createModel('setExtraDataModel'),
        this.createModel('dirtySetModel'),
        this.databaseEventBus
      );
    } else if (modelName === 'setExtraDataModel') {
      model = new SetExtraDataModel();
    } else if (modelName === 'vocabularyModel') {
      model = new VocabularyModel(
        this.createModel('definitionModel'),
        this.createModel('vocabularyCategoryModel'),
        this.createModel('vocabularyLocalDataModel'),
        this.createModel('vocabularyWritingModel'),
        this.createModel('dirtyVocabularyModel'),
        this.databaseEventBus
      );
    } else if (modelName === 'vocabularyCategoryModel') {
      model = new VocabularyCategoryModel();
    } else if (modelName === 'vocabularyLocalDataModel') {
      model = new VocabularyLocalDataModel();
    } else if (modelName === 'vocabularyWritingModel') {
      model = new VocabularyWritingModel(
        this.createModel('dirtyVocabularyWritingModel')
      );
    } else if (modelName === 'definitionModel') {
      model = new DefinitionModel(this.createModel('dirtyDefinitionModel'));
    } else if (modelName === 'categoryModel') {
      model = new CategoryModel();
    } else if (modelName === 'spacedRepetitionModel') {
      model = new SpacedRepetitionModel(this.createModel('vocabularyModel'));
    } else if (modelName === 'writingModel') {
      model = new WritingModel(this.createModel('vocabularyModel'));
    } else if (modelName === 'quizWritingModel') {
      model = new QuizWritingModel(this.createModel('vocabularyModel'));
    } else if (modelName === 'quizMultipleChoiceModel') {
      model = new QuizMultipleChoiceModel(this.createModel('vocabularyModel'));
    } else if (modelName === 'sessionModel') {
      model = new SessionModel();
    } else if (modelName === 'remoteConfigModel') {
      model = new RemoteConfigModel();
    } else if (modelName === 'dirtyDefinitionModel') {
      model = new DirtyDefinitionModel();
    } else if (modelName === 'dirtyVocabularyModel') {
      model = new DirtyVocabularyModel(
        this.createModel('dirtyDefinitionModel'),
        this.createModel('dirtyVocabularyCategoryModel'),
        this.createModel('dirtyVocabularyWritingModel')
      );
    } else if (modelName === 'dirtyVocabularyCategoryModel') {
      model = new DirtyVocabularyCategoryModel();
    } else if (modelName === 'dirtyVocabularyWritingModel') {
      model = new DirtyVocabularyWritingModel();
    } else if (modelName === 'dirtyUserModel') {
      model = new DirtyUserModel(this.createModel('dirtyUserExtraDataModel'));
    } else if (modelName === 'dirtyUserExtraDataModel') {
      model = new DirtyUserExtraDataModel();
    } else if (modelName === 'dirtySetModel') {
      model = new DirtySetModel(this.createModel('dirtySetExtraDataModel'));
    } else if (modelName === 'dirtySetExtraDataModel') {
      model = new DirtySetExtraDataModel();
    } else if (modelName === 'incompatibleSetModel') {
      model = new IncompatibleSetModel();
    } else if (modelName === 'incompatibleVocabularyModel') {
      model = new IncompatibleVocabularyModel();
    } else {
      throw new Error(`modelName ${modelName} is invalid`);
    }

    return model as ModelList[K];
  }
}
