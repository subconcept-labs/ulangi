/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableVocabulary } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { VocabularyItemIds } from '../../constants/ids/VocabularyItemIds';
import { DefaultText } from '../common/DefaultText';
import { DefinitionList } from './DefinitionList';
import { VocabularyExtraFieldList } from './VocabularyExtraFieldList';
import {
  VocabularyItemStyles,
  darkStyles,
  lightStyles,
} from './VocabularyItem.style';

export interface VocabularyItemProps {
  theme: Theme;
  vocabulary: ObservableVocabulary;
  shouldShowTags?: boolean;
  isSelectionModeOn?: IObservableValue<boolean>;
  toggleSelection?: (vocabularyId: string) => void;
  showVocabularyDetail?: (vocabulary: ObservableVocabulary) => void;
  showVocabularyActionMenu?: (vocabulary: ObservableVocabulary) => void;
  styles?: {
    light: VocabularyItemStyles;
    dark: VocabularyItemStyles;
  };
}

@observer
export class VocabularyItem extends React.Component<VocabularyItemProps> {
  public get styles(): VocabularyItemStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        testID={VocabularyItemIds.VIEW_DETAIL_BTN_BY_VOCABULARY_TERM(
          this.props.vocabulary.vocabularyTerm,
        )}
        accessible={false}
        style={this.styles.item_container}
        disabled={typeof this.props.showVocabularyDetail === 'undefined'}
        onPress={(): void => {
          if (typeof this.props.showVocabularyDetail !== 'undefined') {
            this.props.showVocabularyDetail(this.props.vocabulary);
          }
        }}>
        <View style={this.styles.vocabulary_container}>
          {this.renderVocabularyTerm(this.props.vocabulary.vocabularyTerm)}
          {this.renderRightButton()}
        </View>
        <VocabularyExtraFieldList
          theme={this.props.theme}
          extraFields={this.props.vocabulary.vocabularyExtraFields}
        />
        <View style={this.styles.definition_list_container}>
          <DefinitionList
            theme={this.props.theme}
            definitions={this.props.vocabulary.definitions}
          />
        </View>
      </TouchableOpacity>
    );
  }

  private renderTags(): null | React.ReactElement<any> {
    if (this.props.shouldShowTags === true) {
      return (
        <View style={this.styles.tag_list}>
          <View style={this.styles.tag_container}>
            <DefaultText style={this.styles.tag_text}>
              {_.upperFirst(
                config.vocabulary.statusMap[
                  this.props.vocabulary.vocabularyStatus
                ].name,
              )}
            </DefaultText>
          </View>
          <View style={this.styles.dot_container}>
            <DefaultText style={this.styles.dot}>{'\u00B7'}</DefaultText>
          </View>
          <View style={this.styles.tag_container}>
            <DefaultText style={this.styles.tag_text}>{`SR ${
              this.props.vocabulary.level
            }`}</DefaultText>
          </View>
          <View style={this.styles.dot_container}>
            <DefaultText style={this.styles.dot}>{'\u00B7'}</DefaultText>
          </View>
          <View style={this.styles.tag_container}>
            <DefaultText style={this.styles.tag_text}>{`WR ${
              typeof this.props.vocabulary.writing !== 'undefined'
                ? this.props.vocabulary.writing.level
                : 0
            }`}</DefaultText>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  private renderVocabularyTerm(term: string): React.ReactElement<any> {
    return (
      <View style={this.styles.term_container}>
        {term !== '' ? (
          <DefaultText style={this.styles.term}>{term}</DefaultText>
        ) : (
          <DefaultText style={this.styles.missing_term}>
            Missing term!
          </DefaultText>
        )}
        {this.renderTags()}
      </View>
    );
  }

  private renderRightButton(): null | React.ReactElement<any> {
    if (
      typeof this.props.isSelectionModeOn !== 'undefined' &&
      this.props.isSelectionModeOn.get()
    ) {
      return (
        <TouchableOpacity
          testID={
            this.props.vocabulary.isSelected.get() === false
              ? VocabularyItemIds.SELECT_BTN_BY_VOCABULARY_TERM(
                  this.props.vocabulary.vocabularyText,
                )
              : VocabularyItemIds.UNSELECT_BTN_BY_VOCABULARY_TERM(
                  this.props.vocabulary.vocabularyText,
                )
          }
          hitSlop={{ top: 18, bottom: 18, right: 18, left: 18 }}
          onPress={(): void => {
            if (typeof this.props.toggleSelection !== 'undefined') {
              this.props.toggleSelection(this.props.vocabulary.vocabularyId);
            }
          }}
          style={this.styles.option_btn}>
          {this.props.vocabulary.isSelected.get() === true ? (
            <Image source={Images.CHECK_BLUE_22X22} />
          ) : (
            <Image source={Images.UNCHECK_GREY_22X22} />
          )}
        </TouchableOpacity>
      );
    } else if (typeof this.props.showVocabularyActionMenu !== 'undefined') {
      return (
        <TouchableOpacity
          testID={VocabularyItemIds.SHOW_ACTION_MENU_BTN_BY_VOCABULARY_TERM(
            this.props.vocabulary.vocabularyText,
          )}
          hitSlop={{ top: 20, bottom: 20, right: 12, left: 12 }}
          onPress={(): void => {
            if (typeof this.props.showVocabularyActionMenu !== 'undefined') {
              this.props.showVocabularyActionMenu(this.props.vocabulary);
            }
          }}
          style={this.styles.option_btn}>
          <Image source={Images.HORIZONTAL_DOTS_GREY_22X22} />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }
}
