import { ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AddVocabularyFloatingButtonStyles {
  button: ViewStyle;
}

export class AddVocabularyFloatingButtonResponsiveStyles extends ResponsiveStyleSheet<
  AddVocabularyFloatingButtonStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): AddVocabularyFloatingButtonStyles {
    return {
      button: {
        width: scaleByFactor(50),
        height: scaleByFactor(50),
        borderRadius: scaleByFactor(50) / 2,
        backgroundColor: config.styles.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 1,
        shadowOpacity: 0.2,
        elevation: 1,
      },
    };
  }

  public lightStyles(): Partial<AddVocabularyFloatingButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<AddVocabularyFloatingButtonStyles> {
    return {};
  }
}

export const addVocabularyFloatingButtonResponsiveStyles = new AddVocabularyFloatingButtonResponsiveStyles();
