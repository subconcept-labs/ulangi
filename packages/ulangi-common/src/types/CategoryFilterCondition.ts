import { VocabularyDueType } from '../enums/VocabularyDueType';
import { VocabularyStatus } from '../enums/VocabularyStatus';

export type CategoryFilterCondition =
  | {
      filterBy: 'VocabularyStatus';
      setId: string;
      vocabularyStatus: VocabularyStatus;
    }
  | {
      filterBy: 'VocabularyDueType';
      setId: string;
      initialInterval: number;
      dueType: VocabularyDueType;
    };
