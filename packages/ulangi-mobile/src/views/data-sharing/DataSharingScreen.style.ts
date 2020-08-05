import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DataSharingScreenStyles {
  screen: ViewStyle;
  title: TextStyle;
  paragraph: TextStyle;
  button_container: ViewStyle;
}

export class DataSharingScreenResponsiveStyles extends ResponsiveStyleSheet<
  DataSharingScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): DataSharingScreenStyles {
    return {
      screen: {
        flex: 1,
        paddingHorizontal: scaleByFactor(16),
      },
      title: {
        marginVertical: scaleByFactor(16),
        fontSize: scaleByFactor(16),
        fontWeight: 'bold',
      },

      paragraph: {
        paddingTop: scaleByFactor(8),
        fontSize: scaleByFactor(15),
      },

      button_container: {
        marginTop: scaleByFactor(24),
      },
    };
  }

  public lightStyles(): Partial<DataSharingScreenStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },
      paragraph: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<DataSharingScreenStyles> {
    return {
      title: {
        color: config.styles.dark.primaryTextColor,
      },
      paragraph: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const dataSharingScreenResponsiveStyles = new DataSharingScreenResponsiveStyles();
