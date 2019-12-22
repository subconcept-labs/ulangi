/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ModelList } from '../interfaces/ModelList';
import { ApiKeyModel } from '../models/ApiKeyModel';
import { DefinitionModel } from '../models/DefinitionModel';
import { LockModel } from '../models/LockModel';
import { PurchaseModel } from '../models/PurchaseModel';
import { ResetPasswordModel } from '../models/ResetPasswordModel';
import { SetExtraDataModel } from '../models/SetExtraDataModel';
import { SetModel } from '../models/SetModel';
import { UserExtraDataModel } from '../models/UserExtraDataModel';
import { UserModel } from '../models/UserModel';
import { VocabularyCategoryModel } from '../models/VocabularyCategoryModel';
import { VocabularyModel } from '../models/VocabularyModel';
import { VocabularyWritingModel } from '../models/VocabularyWritingModel';

export class ModelFactory {
  public createAllModels(): ModelList {
    return {
      definitionModel: this.createModel('definitionModel'),
      vocabularyCategoryModel: this.createModel('vocabularyCategoryModel'),
      vocabularyWritingModel: this.createModel('vocabularyWritingModel'),
      vocabularyModel: this.createModel('vocabularyModel'),
      setExtraDataModel: this.createModel('setExtraDataModel'),
      setModel: this.createModel('setModel'),
      userExtraDataModel: this.createModel('userExtraDataModel'),
      userModel: this.createModel('userModel'),
      resetPasswordModel: this.createModel('resetPasswordModel'),
      lockModel: this.createModel('lockModel'),
      apiKeyModel: this.createModel('apiKeyModel'),
      purchaseModel: this.createModel('purchaseModel'),
    };
  }

  public createModel<K extends keyof ModelList>(modelName: K): ModelList[K] {
    let model;
    if (modelName === 'definitionModel') {
      model = new DefinitionModel();
    } else if (modelName === 'vocabularyCategoryModel') {
      model = new VocabularyCategoryModel();
    } else if (modelName === 'vocabularyWritingModel') {
      model = new VocabularyWritingModel();
    } else if (modelName === 'vocabularyModel') {
      model = new VocabularyModel(
        this.createModel('definitionModel'),
        this.createModel('vocabularyCategoryModel'),
        this.createModel('vocabularyWritingModel')
      );
    } else if (modelName === 'setExtraDataModel') {
      model = new SetExtraDataModel();
    } else if (modelName === 'setModel') {
      model = new SetModel(this.createModel('setExtraDataModel'));
    } else if (modelName === 'userExtraDataModel') {
      model = new UserExtraDataModel();
    } else if (modelName === 'userModel') {
      model = new UserModel(this.createModel('userExtraDataModel'));
    } else if (modelName === 'resetPasswordModel') {
      model = new ResetPasswordModel();
    } else if (modelName === 'lockModel') {
      model = new LockModel();
    } else if (modelName === 'apiKeyModel') {
      model = new ApiKeyModel(this.createModel('userModel'));
    } else if (modelName === 'purchaseModel') {
      model = new PurchaseModel();
    } else {
      throw new Error('Invalid modelName');
    }

    return model as ModelList[K];
  }
}
