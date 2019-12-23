/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableVocabulary } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';

import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';

export interface VocabularyDetailSpacedRepetitionInfoProps {
  theme: Theme;
  vocabulary: ObservableVocabulary;
  nextReview: string;
}

export class VocabularyDetailSpacedRepetitionInfo extends React.Component<
  VocabularyDetailSpacedRepetitionInfoProps
> {
  public render(): React.ReactElement<any> {
    return (
      <SectionGroup theme={this.props.theme} header="SPACED REPETITION INFO">
        <SectionRow
          key="level"
          theme={this.props.theme}
          leftText="SR Level"
          rightText={this.props.vocabulary.level.toString()}
        />
        <SectionRow
          key="last_learned"
          theme={this.props.theme}
          leftText="Last Learned"
          rightText={
            this.props.vocabulary.lastLearnedAt === null
              ? 'N/A'
              : _.upperFirst(
                  moment(this.props.vocabulary.lastLearnedAt).fromNow(),
                )
          }
        />
        <SectionRow
          key="next_review"
          theme={this.props.theme}
          leftText="Next Review"
          rightText={_.upperFirst(this.props.nextReview)}
        />
      </SectionGroup>
    );
  }
}
