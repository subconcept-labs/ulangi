/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { VocabularyBuilder } from '../../builders/VocabularyBuilder';
import { DownloadVocabularyResponseResolver } from './DownloadVocabularyResponseResolver';

describe('DownloadVocabularyResponseResolver', (): void => {
  test('filter out unknown properties of vocabulary in vocabulary list', (): void => {
    const vocabularyWithUnknownProps = _.merge(
      new VocabularyBuilder().build({
        vocabularyText: 'test',
      }),
      {
        unknownProp: 'unknown',
      }
    );

    const result = new DownloadVocabularyResponseResolver().resolve(
      {
        vocabularyList: [vocabularyWithUnknownProps],
        vocabularySetIdPairs: [],
        noMore: true,
      },
      true
    );

    expect(result).toEqual({
      vocabularyList: [_.omit(vocabularyWithUnknownProps, 'unknownProp')],
      vocabularySetIdPairs: [],
      noMore: true,
    });
  });

  test('filter out unknown object in vocabulary list', (): void => {
    const unknownObject = {
      test: 'test',
    };

    const result = new DownloadVocabularyResponseResolver().resolve(
      {
        vocabularyList: [unknownObject],
        vocabularySetIdPairs: [],
        noMore: true,
      },
      true
    );

    expect(result).toEqual({
      vocabularyList: [],
      vocabularySetIdPairs: [],
      noMore: true,
    });
  });

  test('filter out unknown object, invalid object and unknown prop of vocabulary in vocabulary list', (): void => {
    const vocabularyWithUnknownProps = _.merge(
      new VocabularyBuilder().build({
        vocabularyText: 'test',
      }),
      {
        unknownProp: 'unknown',
      }
    );

    const unknownObject = {
      test: 'test',
    };

    const vocabularyWithInvalidProps = new VocabularyBuilder().build({
      vocabularyText: 'test',
      level: 'invalid level',
    } as any);

    const result = new DownloadVocabularyResponseResolver().resolve(
      {
        vocabularyList: [
          vocabularyWithUnknownProps,
          unknownObject,
          vocabularyWithInvalidProps,
        ],
        vocabularySetIdPairs: [],
        noMore: true,
      },
      true
    );

    expect(result).toEqual({
      vocabularyList: [_.omit(vocabularyWithUnknownProps, 'unknownProp')],
      vocabularySetIdPairs: [],
      noMore: true,
    });
  });
});
