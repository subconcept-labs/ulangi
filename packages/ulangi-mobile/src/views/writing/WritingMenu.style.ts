import { ViewStyle } from 'react-native';

import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface WritingMenuStyles {
  container: ViewStyle;
  primary_button_container: ViewStyle;
  secondary_button_container: ViewStyle;
}

export class WritingMenuResponsiveStyles extends ResponsiveStyleSheet<
  WritingMenuStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): WritingMenuStyles {
    return {
      container: {
        marginTop: scaleByFactor(42),
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },
      primary_button_container: {
        marginHorizontal: scaleByFactor(5),
        marginVertical: scaleByFactor(6),
      },
      secondary_button_container: {
        marginHorizontal: scaleByFactor(22),
        marginVertical: scaleByFactor(6),
      },
    };
  }

  public lightStyles(): Partial<WritingMenuStyles> {
    return {};
  }

  public darkStyles(): Partial<WritingMenuStyles> {
    return {};
  }
}

export const writingMenuResponsiveStyles = new WritingMenuResponsiveStyles();
