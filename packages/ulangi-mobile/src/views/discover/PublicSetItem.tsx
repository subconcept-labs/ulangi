/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservablePublicSet } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { PublicSetItemIds } from '../../constants/ids/PublicSetItemIds';
import { DefaultText } from '../common/DefaultText';
import {
  PublicSetItemStyles,
  darkStyles,
  lightStyles,
} from './PublicSetItem.style';

export interface PublicSetItemProps {
  theme: Theme;
  set: ObservablePublicSet;
  showSetDetailModal: (set: ObservablePublicSet) => void;
  styles?: {
    light: PublicSetItemStyles;
    dark: PublicSetItemStyles;
  };
}

@observer
export class PublicSetItem extends React.Component<PublicSetItemProps> {
  public get styles(): PublicSetItemStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      // Note: By wrappping the content container with touchable
      // instead of using touchable directly, it makes the hit area wider
      // thus fix scrolling problem
      <TouchableOpacity
        testID={PublicSetItemIds.VIEW_DETAIL_BTN_BY_SET_TITLE(
          this.props.set.title,
        )}
        onPress={(): void => this.props.showSetDetailModal(this.props.set)}
        hitSlop={{ top: 8, bottom: 8 }}
        style={this.styles.item_container}>
        <View style={this.styles.top_container}>
          <View style={this.styles.left}>
            <DefaultText style={this.styles.title}>
              <DefaultText style={this.styles.set_name}>
                {this.props.set.title}
              </DefaultText>
              {typeof this.props.set.subtitle !== 'undefined' &&
              this.props.set.subtitle !== '' ? (
                <DefaultText style={this.styles.set_subtitle}>
                  {' ' + this.props.set.subtitle}
                </DefaultText>
              ) : null}
            </DefaultText>
            <View style={this.styles.meta_container}>
              <DefaultText>
                <DefaultText style={this.styles.authors}>
                  {'By ' +
                    this.props.set.formattedAuthors
                      .map(({ formattedName }): string => formattedName)
                      .join(', ')}
                </DefaultText>
                {this.props.set.isCurated === true ? (
                  <React.Fragment>
                    <DefaultText style={this.styles.dot}>
                      {' \u00B7 '}
                    </DefaultText>
                    <DefaultText style={this.styles.curated_text}>
                      Curated
                    </DefaultText>
                  </React.Fragment>
                ) : null}
              </DefaultText>
            </View>
          </View>
          <View style={this.styles.right}>
            <DefaultText style={this.styles.count}>
              {this.props.set.vocabularyList.length}
            </DefaultText>
            <DefaultText style={this.styles.terms}>terms</DefaultText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  /*
  private renderBottomContainer(): React.ReactElement<any> {
    return (
      <View style={this.styles.bottom_container}>
        <DefaultText numberOfLines={1} style={this.styles.content}>
          <DefaultText style={this.styles.content_bold}>
            Contents:{' '}
          </DefaultText>
          <DefaultText>
            {_.take(this.props.set.vocabularyList, 10)
              .map((vocabulary): string => vocabulary.vocabularyTerm)
              .join(', ')}
          </DefaultText>
        </DefaultText>
      </View>
    )
  }
  */
}
