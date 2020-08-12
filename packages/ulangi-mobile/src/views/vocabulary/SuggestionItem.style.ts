import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SuggestionItemStyles {
  item_container: ViewStyle;
  text: TextStyle;
  importance: TextStyle;
  dot: TextStyle;
  message: TextStyle;
  button_list: ViewStyle;
  button: ViewStyle;
  button_text: TextStyle;
}

export class SuggestionItemResponsiveStyles extends ResponsiveStyleSheet<
  SuggestionItemStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SuggestionItemStyles {
    return {
      item_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      text: {},

      importance: {
        fontSize: scaleByFactor(12),
        fontWeight: 'bold',
        letterSpacing: -1,
        textAlignVertical: 'center',
      },

      dot: {
        fontSize: scaleByFactor(14),
        fontWeight: 'bold',
      },

      message: {
        fontSize: scaleByFactor(16),
      },

      button_list: {
        marginTop: scaleByFactor(4),
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },

      button: {
        borderRadius: scaleByFactor(3),
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: scaleByFactor(8),
        paddingVertical: scaleByFactor(5),
        marginHorizontal: scaleByFactor(4),
        marginVertical: scaleByFactor(4),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.75,
        shadowOpacity: 0.15,
        elevation: 0.75,
      },

      button_text: {
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<SuggestionItemStyles> {
    return {
      item_container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      importance: {
        color: config.styles.light.secondaryTextColor,
      },

      dot: {
        color: config.styles.light.secondaryTextColor,
      },

      message: {
        color: config.styles.light.primaryTextColor,
      },

      button: {
        borderColor: config.styles.light.primaryBorderColor,
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      button_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SuggestionItemStyles> {
    return {
      item_container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      importance: {
        color: config.styles.dark.secondaryTextColor,
      },

      dot: {
        color: config.styles.dark.secondaryTextColor,
      },

      message: {
        color: config.styles.dark.primaryTextColor,
      },

      button: {
        borderColor: config.styles.dark.primaryBorderColor,
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      button_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const suggestionItemResponsiveStyles = new SuggestionItemResponsiveStyles();
