import { VocabularyDueType } from '../enums/VocabularyDueType';
import { VocabularyStatus } from '../enums/VocabularyStatus';

export type VocabularyFilterCondition =
  | {
      filterBy: 'VocabularyStatus';
      setId: string;
      vocabularyStatus: VocabularyStatus;
      categoryNames: undefined | string[];
    }
  | {
      filterBy: 'VocabularyDueType';
      setId: string;
      initialInterval: number;
      dueType: VocabularyDueType;
      categoryNames: undefined | string[];
    };
