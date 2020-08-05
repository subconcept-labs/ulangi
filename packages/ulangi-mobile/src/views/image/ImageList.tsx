/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservablePixabayImage,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { IObservableArray, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList, View } from 'react-native';

import { Layout } from '../../utils/responsive';
import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { DefaultText } from '../common/DefaultText';
import { ImageListStyles, imageListResponsiveStyles } from './ImageList.style';
import { SelectableImage } from './SelectableImage';

export interface ImageListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  images: null | IObservableArray<ObservablePixabayImage>;
  isRefreshing: IObservableValue<boolean>;
  searchState: IObservableValue<ActivityState>;
  onEndReached: () => void;
  refresh: () => void;
  toggleSelect: (image: ObservablePixabayImage) => void;
  goToPixabay: () => void;
  styles?: {
    light: ImageListStyles;
    dark: ImageListStyles;
  };
}

@observer
export class ImageList extends React.Component<ImageListProps> {
  private readonly numColumns = 3;
  private readonly imagePadding = 16;

  private keyExtractor = (item: ObservablePixabayImage): string =>
    item.id.toString();

  private get styles(): ImageListStyles {
    return imageListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
      {
        imagePadding: this.imagePadding,
        numColumns: this.numColumns,
      },
    );
  }

  private calculateImageDimension(): Layout {
    const width =
      (this.props.screenLayout.width -
        this.imagePadding * 2 * (this.numColumns + 1)) /
      this.numColumns;

    return {
      width,
      height: width,
    };
  }

  public render(): React.ReactElement<any> {
    return (
      <FlatList
        style={this.styles.container}
        contentContainerStyle={this.styles.content_container}
        data={this.props.images !== null ? this.props.images.slice() : []}
        numColumns={this.numColumns}
        ListEmptyComponent={
          this.props.images !== null ? this.renderEmpty() : null
        }
        ListHeaderComponent={this.renderHeader()}
        ListFooterComponent={
          <DefaultActivityIndicator
            activityState={this.props.searchState}
            size="small"
            style={this.styles.activity_indicator}
            isRefreshing={this.props.isRefreshing}
          />
        }
        stickyHeaderIndices={[0]}
        keyExtractor={this.keyExtractor}
        renderItem={({
          item,
        }: {
          item: ObservablePixabayImage;
        }): React.ReactElement<any> => {
          return (
            <SelectableImage
              theme={this.props.theme}
              screenLayout={this.props.screenLayout}
              image={item}
              imagePadding={this.imagePadding}
              imageDimensions={this.calculateImageDimension()}
              toggleSelect={(): void => this.props.toggleSelect(item)}
            />
          );
        }}
        onEndReached={this.props.onEndReached}
        refreshing={this.props.isRefreshing.get()}
        onRefresh={this.props.refresh}
      />
    );
  }

  private renderEmpty(): React.ReactElement<any> {
    return (
      <View style={this.styles.empty_container}>
        <DefaultText style={this.styles.empty_text}>
          No images found.
        </DefaultText>
      </View>
    );
  }

  private renderHeader(): null | React.ReactElement<any> {
    return (
      <View style={this.styles.header_container}>
        <DefaultText style={this.styles.header_text}>
          <DefaultText>IMAGES FROM </DefaultText>
          <DefaultText
            style={this.styles.highlighted}
            onPress={this.props.goToPixabay}>
            PIXABAY
          </DefaultText>
        </DefaultText>
      </View>
    );
  }
}
