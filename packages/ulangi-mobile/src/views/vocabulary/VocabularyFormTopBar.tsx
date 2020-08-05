/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import * as React from 'react';
import { Keyboard, TouchableOpacity, View } from 'react-native';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import {
  VocabularyFormTopBarStyles,
  vocabularyFormTopBarResponsiveStyles,
} from './VocabularyFormTopBar.style';

export interface VocabularyFormTopBarProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  currentTab: IObservableValue<'Editor' | 'Preview'>;
}

export class VocabularyFormTopBar extends React.Component<
  VocabularyFormTopBarProps
> {
  public get styles(): VocabularyFormTopBarStyles {
    return vocabularyFormTopBarResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    const tabs: ['Editor', 'Preview'] = ['Editor', 'Preview'];
    return (
      <View style={this.styles.top_bar_container}>
        {tabs.map(
          (tab: 'Editor' | 'Preview'): React.ReactElement<any> => {
            const isSelected =
              tab === this.props.currentTab.get() ? true : false;
            const selectedContainerStyle = isSelected
              ? this.styles.selectedContainerStyle
              : {};
            const selectedTextStyle = isSelected
              ? this.styles.selectedTextStyle
              : {};
            return (
              <TouchableOpacity
                testID={VocabularyFormIds.SELECT_TAB_BTN_BY_TAB_TYPE(tab)}
                key={tab}
                style={[this.styles.text_container, selectedContainerStyle]}
                onPress={(): void => {
                  Keyboard.dismiss();
                  this.props.currentTab.set(tab);
                }}>
                <DefaultText style={[this.styles.text, selectedTextStyle]}>
                  {tab}
                </DefaultText>
              </TouchableOpacity>
            );
          },
        )}
      </View>
    );
  }
}
