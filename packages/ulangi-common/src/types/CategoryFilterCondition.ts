import { VocabularyStatus } from '../enums/VocabularyStatus';

export interface CategoryFilterCondition {
  filterBy: 'VocabularyStatus';
  setId: string;
  vocabularyStatus: VocabularyStatus;
}
