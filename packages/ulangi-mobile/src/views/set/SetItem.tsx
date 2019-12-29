/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ReadonlyTuple } from '@ulangi/extended-types';
import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSet } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { SetItemIds } from '../../constants/ids/SetItemIds';
import { DefaultText } from '../common/DefaultText';
import { SetItemStyles, darkStyles, lightStyles } from './SetItem.style';

export interface SetItemProps {
  theme: Theme;
  currentSetId: string;
  setTuple: ReadonlyTuple<string, ObservableSet>;
  showSetActionMenu: (set: ObservableSet) => void;
  styles?: {
    light: SetItemStyles;
    dark: SetItemStyles;
  };
}

@observer
export class SetItem extends React.Component<SetItemProps> {
  public get styles(): SetItemStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    const [, set] = this.props.setTuple;
    return (
      <View
        style={this.styles.cell_container}
        testID={SetItemIds.SET_ITEM_CONTAINER_BY_SET_NAME(set.setName)}>
        <View style={this.styles.icon_container}>
          {_.has(
            Images.FLAG_ICONS_BY_LANGUAGE_CODE,
            set.learningLanguageCode,
          ) ? (
            <Image
              style={this.styles.flag_icon}
              source={_.get(
                Images.FLAG_ICONS_BY_LANGUAGE_CODE,
                set.learningLanguageCode,
              )}
            />
          ) : (
            <Image
              style={this.styles.flag_icon}
              source={Images.FLAG_ICONS_BY_LANGUAGE_CODE.any}
            />
          )}
        </View>
        <View style={this.styles.content_container}>
          <View style={this.styles.left}>
            <View style={this.styles.set_name_container}>
              <DefaultText style={this.styles.set_name}>
                {set.setName}
              </DefaultText>
            </View>
            <View style={this.styles.meta_container}>
              <DefaultText style={this.styles.meta_text}>
                <DefaultText style={this.styles.language}>
                  {set.learningLanguage.languageCode +
                    ' - ' +
                    set.translatedToLanguage.languageCode}
                </DefaultText>
                {this.props.currentSetId === set.setId ? (
                  <React.Fragment>
                    <DefaultText style={this.styles.dot}>
                      {' \u00B7 '}
                    </DefaultText>
                    <DefaultText style={this.styles.current_text}>
                      Current
                    </DefaultText>
                  </React.Fragment>
                ) : null}
              </DefaultText>
            </View>
          </View>
          <View style={this.styles.right}>
            <TouchableOpacity
              testID={SetItemIds.SHOW_ACTION_MENU_BTN_BY_SET_NAME(set.setName)}
              hitSlop={{ top: 18, bottom: 18, left: 10, right: 10 }}
              style={this.styles.option_touchable}
              onPress={(): void => this.props.showSetActionMenu(set)}>
              <Image source={Images.HORIZONTAL_DOTS_GREY_22X6} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
