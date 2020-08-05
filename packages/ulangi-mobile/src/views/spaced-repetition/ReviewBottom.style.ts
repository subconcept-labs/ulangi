import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReviewBottomStyles {
  container: ViewStyle;
  horizontal_line: ViewStyle;
}

export class ReviewBottomResponsiveStyles extends ResponsiveStyleSheet<
  ReviewBottomStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReviewBottomStyles {
    return {
      container: {},

      horizontal_line: {
        marginHorizontal: scaleByFactor(8),
        height: StyleSheet.hairlineWidth,
      },
    };
  }

  public lightStyles(): Partial<ReviewBottomStyles> {
    return {
      container: {
        borderTopColor: config.styles.light.primaryBorderColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
        backgroundColor: config.styles.light.secondaryBackgroundColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.light.secondaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<ReviewBottomStyles> {
    return {
      container: {
        borderTopColor: config.styles.dark.primaryBorderColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.dark.secondaryBorderColor,
      },
    };
  }
}

export const reviewBottomResponsiveStyles = new ReviewBottomResponsiveStyles();
