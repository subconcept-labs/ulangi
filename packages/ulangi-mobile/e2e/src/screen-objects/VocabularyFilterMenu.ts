import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

import { VocabularyFilterMenuIds } from '../../../src/constants/ids/VocabularyFilterMenuIds';
import { Element } from '../adapters/Element';

export class VocabularyFilterMenu {
  public async selectFilter(filterType: VocabularyFilterType): Promise<void> {
    await Element.byId(
      VocabularyFilterMenuIds.FILTER_BTN_BY_FILTER_TYPE(filterType)
    ).tap();
  }
}

export const vocabularyFilterMenu = new VocabularyFilterMenu();
