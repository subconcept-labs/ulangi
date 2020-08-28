import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { RatingStyles, ratingResponsiveStyles } from './Rating.style';

export interface RatingProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  currentRating: undefined | 1 | 2 | 3 | 4 | 5;
  setRating: (rating: number) => void;
}

@observer
export class Rating extends React.Component<RatingProps> {
  private get styles(): RatingStyles {
    return ratingResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    const maxRating = 5;
    return (
      <View style={this.styles.container}>
        {typeof this.props.currentRating !== 'undefined'
          ? _.range(1, this.props.currentRating + 1).map(
              (rating: number): React.ReactElement<any> => {
                return (
                  <TouchableOpacity
                    key={rating}
                    style={this.styles.icon_container}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                    onPress={(): void => this.props.setRating(rating)}>
                    <Image
                      style={this.styles.icon}
                      source={Images.STAR_GREY_22X22}
                    />
                  </TouchableOpacity>
                );
              },
            )
          : null}
        {typeof this.props.currentRating === 'undefined' ||
        this.props.currentRating < maxRating
          ? _.range((this.props.currentRating || 0) + 1, maxRating + 1).map(
              (rating: number): React.ReactElement<any> => {
                return (
                  <TouchableOpacity
                    key={rating}
                    style={this.styles.icon_container}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                    onPress={(): void => this.props.setRating(rating)}>
                    <Image
                      style={this.styles.icon}
                      source={Images.STAR_LINE_GREY_22X22}
                    />
                  </TouchableOpacity>
                );
              },
            )
          : null}
      </View>
    );
  }
}
