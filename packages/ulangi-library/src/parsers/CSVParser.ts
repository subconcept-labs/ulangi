/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  PublicDefinition,
  PublicSet,
  PublicVocabulary,
} from '@ulangi/ulangi-common/interfaces';
import {
  PublicSetResolver,
  PublicVocabularyResolver,
} from '@ulangi/ulangi-common/resolvers';
import * as _ from 'lodash';
import * as Papa from 'papaparse';

export class CSVParser {
  private publicSetResolver = new PublicSetResolver();
  private publicVocabularyResolver = new PublicVocabularyResolver();

  public parse(csvString: string): readonly PublicSet[] {
    const parseResult = Papa.parse(csvString);
    const data: string[][] = parseResult.data;

    const columnWidth = 3;
    const dividerWidth = 1;
    const publicSetIdCoor = [0, 1];
    const languageCodePairCoor = [1, 1];
    const titleCoor = [2, 1];
    const subtitleCoor = [3, 1];
    const difficultyCoor = [4, 1];
    const tagsCoor = [5, 1];
    const authorsCoor = [6, 1];
    const curatedCoor = [7, 1];
    const vocabularyStartCoor = [10, 0];

    const origin = [0, 0];
    const setList: PublicSet[] = [];

    while (origin[1] < data[1].length) {
      const title = data[origin[0] + titleCoor[0]][origin[1] + titleCoor[1]];
      const authors = JSON.parse(
        data[origin[0] + authorsCoor[0]][origin[1] + authorsCoor[1]]
      );

      const vocabularyCoor = _.zipWith(
        vocabularyStartCoor,
        origin,
        (a, b): number => a + b
      );
      const vocabularyList: PublicVocabulary[] = [];

      //let order = 0;
      while (
        vocabularyCoor[0] < data.length &&
        data[vocabularyCoor[0]][vocabularyCoor[1]] !== ''
      ) {
        const vocabulary = this.publicVocabularyResolver.resolve(
          {
            publicVocabularyId: data[vocabularyCoor[0]][vocabularyCoor[1]],
            vocabularyText: data[vocabularyCoor[0]][vocabularyCoor[1] + 1],
            definitions: this.parseDefinitions(
              data[vocabularyCoor[0]][vocabularyCoor[1] + 2],
              authors.map((author: any): string => author.name).join(',')
            ),
            categories: [title],
          },
          true
        );

        vocabularyList.push(vocabulary);
        vocabularyCoor[0]++;
        //order++;
      }

      const set = this.publicSetResolver.resolve(
        {
          publicSetId:
            data[origin[0] + publicSetIdCoor[0]][
              origin[1] + publicSetIdCoor[1]
            ],
          languageCodePair:
            data[origin[0] + languageCodePairCoor[0]][
              origin[1] + languageCodePairCoor[1]
            ],
          title,
          subtitle:
            data[origin[0] + subtitleCoor[0]][origin[1] + subtitleCoor[1]],
          difficulty:
            data[origin[0] + difficultyCoor[0]][origin[1] + difficultyCoor[1]],
          tags: data[origin[0] + tagsCoor[0]][origin[1] + tagsCoor[1]]
            .split(',')
            .map(_.trim)
            .filter((tag): boolean => !_.isEmpty(tag)),
          authors,
          isCurated:
            data[origin[0] + curatedCoor[0]][origin[1] + curatedCoor[1]],
          vocabularyList,
        },
        true
      );

      setList.push(set);

      // Shift origin
      origin[0] = 0;
      origin[1] += columnWidth + dividerWidth;
    }

    return setList;
  }

  private parseDefinitions(
    text: string,
    source: string
  ): readonly PublicDefinition[] {
    return text.split('---').map(
      (definition): PublicDefinition => {
        return {
          meaning: definition.trim(),
          source,
          wordClasses: [],
        };
      }
    );
  }
}
