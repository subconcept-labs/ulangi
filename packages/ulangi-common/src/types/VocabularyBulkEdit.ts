import { VocabularyStatus } from '../enums/VocabularyStatus';

export type VocabularyBulkEdit =
  | {
      type: 'moveToSet';
      newSetId: string;
    }
  | {
      type: 'changeStatus';
      newVocabularyStatus: VocabularyStatus;
    }
  | {
      type: 'recategorize';
      newCategoryName: string;
    };
