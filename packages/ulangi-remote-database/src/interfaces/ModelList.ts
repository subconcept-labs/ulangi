/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

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

export interface ModelList {
  userModel: UserModel;
  userExtraDataModel: UserExtraDataModel;
  apiKeyModel: ApiKeyModel;
  resetPasswordModel: ResetPasswordModel;
  setModel: SetModel;
  setExtraDataModel: SetExtraDataModel;
  vocabularyModel: VocabularyModel;
  definitionModel: DefinitionModel;
  vocabularyCategoryModel: VocabularyCategoryModel;
  vocabularyWritingModel: VocabularyWritingModel;
  lockModel: LockModel;
  purchaseModel: PurchaseModel;
}
