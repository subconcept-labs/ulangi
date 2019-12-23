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

export interface VocabularyDetailWritingInfoProps {
  theme: Theme;
  vocabulary: ObservableVocabulary;
  nextReview: string;
}

export class VocabularyDetailWritingInfo extends React.Component<
  VocabularyDetailWritingInfoProps
> {
  public render(): React.ReactElement<any> {
    return (
      <SectionGroup theme={this.props.theme} header="WRITING INFO">
        <SectionRow
          key="level"
          theme={this.props.theme}
          leftText="WR Level"
          rightText={
            typeof this.props.vocabulary.writing !== 'undefined'
              ? this.props.vocabulary.writing.level.toString()
              : '0'
          }
        />
        <SectionRow
          key="last_written"
          theme={this.props.theme}
          leftText="Last Written"
          rightText={
            typeof this.props.vocabulary.writing === 'undefined' ||
            this.props.vocabulary.writing.lastWrittenAt === null
              ? 'N/A'
              : _.upperFirst(
                  moment(this.props.vocabulary.writing.lastWrittenAt).fromNow(),
                )
          }
        />
        <SectionRow
          key="next_review"
          theme={this.props.theme}
          leftText="Next Review"
          rightText={_.upperFirst(this.props.nextReview)}
        />
        <SectionRow
          key="writing_disabled"
          theme={this.props.theme}
          leftText="Disabled"
          rightText={
            typeof this.props.vocabulary.writing !== 'undefined'
              ? this.props.vocabulary.writing.disabled === true
                ? 'Yes'
                : 'No'
              : 'No'
          }
        />
      </SectionGroup>
    );
  }
}
