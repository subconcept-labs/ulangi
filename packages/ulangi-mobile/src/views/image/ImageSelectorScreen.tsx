/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableDimensions,
  ObservableImageSelectorScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ImageSelectorScreenIds } from '../../constants/ids/ImageSelectorScreenIds';
import { ImageSelectorScreenDelegate } from '../../delegates/image/ImageSelectorScreenDelegate';
import { ImageList } from './ImageList';
import { SearchInput } from './SearchInput';

export interface ImageSelectorScreenProps {
  themeStore: ObservableThemeStore;
  observableDimensions: ObservableDimensions;
  observableScreen: ObservableImageSelectorScreen;
  screenDelegate: ImageSelectorScreenDelegate;
}

@observer
export class ImageSelectorScreen extends React.Component<
  ImageSelectorScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={ImageSelectorScreenIds.SCREEN}>
        <SearchInput
          theme={this.props.themeStore.theme}
          input={this.props.observableScreen.input}
          shouldFocusInput={this.props.observableScreen.shouldFocusInput}
          onSubmitEditing={this.props.screenDelegate.resetSearch}
        />
        <ImageList
          theme={this.props.themeStore.theme}
          observableDimensions={this.props.observableDimensions}
          images={this.props.observableScreen.images}
          searchState={this.props.observableScreen.searchState}
          isRefreshing={this.props.observableScreen.isRefreshing}
          onEndReached={this.props.screenDelegate.search}
          toggleSelect={this.props.screenDelegate.toggleSelect}
          refresh={this.props.screenDelegate.resetSearch}
          goToPixabay={this.props.screenDelegate.goToPixabay}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
