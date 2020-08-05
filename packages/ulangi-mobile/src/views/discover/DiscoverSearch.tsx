/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import { IObservableValue, autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { DiscoverScreenIds } from '../../constants/ids/DiscoverScreenIds';
import { DefaultTextInput } from '../common/DefaultTextInput';
import {
  DiscoverSearchStyles,
  discoverSearchResponsiveStyles,
} from './DiscoverSearch.style';

export interface DiscoverSearchProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  setStore: ObservableSetStore;
  searchInput: IObservableValue<string>;
  searchInputAutoFocus: IObservableValue<boolean>;
  shouldFocusSearchInput: IObservableValue<boolean>;
  clearSearchInput: () => void;
  onSubmitEditing: () => void;
  styles?: {
    light: DiscoverSearchStyles;
    dark: DiscoverSearchStyles;
  };
}

@observer
export class DiscoverSearch extends React.Component<DiscoverSearchProps> {
  private textInputRef: TextInput | null | undefined;
  private unsubscribeFocus?: () => void;

  public componentDidMount(): void {
    this.unsubscribeFocus = autorun(
      (): void => {
        if (
          this.textInputRef &&
          this.props.shouldFocusSearchInput.get() === true
        ) {
          this.textInputRef.focus();
          this.props.shouldFocusSearchInput.set(false);
        }
      },
    );
  }

  public componentWillUnmount(): void {
    if (typeof this.unsubscribeFocus !== 'undefined') {
      this.unsubscribeFocus();
    }
  }

  private get styles(): DiscoverSearchStyles {
    return discoverSearchResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.search_container}>
        <Image
          style={this.styles.search_icon}
          source={Images.SEARCH_GREY_14X14}
        />
        <DefaultTextInput
          ref={(ref): void => {
            this.textInputRef = ref;
          }}
          testID={DiscoverScreenIds.SEARCH_INPUT}
          autoFocus={this.props.searchInputAutoFocus.get()}
          style={this.styles.search_input}
          value={this.props.searchInput.get()}
          placeholder="e.g. cat, animals..."
          placeholderTextColor={
            this.props.theme === Theme.LIGHT
              ? config.styles.light.secondaryTextColor
              : config.styles.dark.secondaryTextColor
          }
          autoCapitalize="none"
          returnKeyType="search"
          onChangeText={(text): void => {
            this.props.searchInput.set(text);
          }}
          onSubmitEditing={this.props.onSubmitEditing}
        />
        <TouchableOpacity
          testID={DiscoverScreenIds.CLEAR_SEARCH_INPUT}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={this.props.clearSearchInput}>
          <Image
            style={this.styles.remove_icon}
            source={Images.REMOVE_GREY_16X16}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
