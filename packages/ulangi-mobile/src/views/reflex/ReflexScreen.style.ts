import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface ReflexScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  selected_categories_container: ViewStyle;
}

export class ReflexScreenResponsiveStyles extends ResponsiveStyleSheet<
  ReflexScreenStyles
> {
  public baseStyles(): ReflexScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      container: {
        flex: 1,
        justifyContent: 'space-between',
      },

      selected_categories_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    };
  }

  public lightStyles(): Partial<ReflexScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<ReflexScreenStyles> {
    return {};
  }
}

export const reflexScreenResponsiveStyles = new ReflexScreenResponsiveStyles();
