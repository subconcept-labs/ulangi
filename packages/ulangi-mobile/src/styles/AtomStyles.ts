/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';

import { config } from '../constants/config';
import {
  Layout,
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../utils/responsive';
import { fullRoundedButtonStyles } from './FullRoundedButtonStyles';

export class AtomStyles {
  public getScreenStyle(options?: any): Options {
    return _.merge(
      {
        statusBar: {
          style: 'light',
          backgroundColor: config.atom.backgroundColor,
        },
        topBar: {
          visible: false,
          animate: true,
          noBorder: true,
          background: {
            color: config.atom.backgroundColor,
          },
          // to hide on Android
          height: 0,
          backButton: {
            visible: false,
          },
        },
        bottomTabs: {
          visible: false,
          animate: false,
          drawBehind: true,
        },
        layout: {
          backgroundColor: config.atom.backgroundColor,
        },
      },
      options,
    );
  }

  public getLightBoxScreenStyles(): { light: Options; dark: Options } {
    return {
      light: {
        statusBar: {
          style: 'light',
          backgroundColor: config.atom.backgroundColor,
        },
      },
      dark: {
        statusBar: {
          style: 'light',
          backgroundColor: config.atom.backgroundColor,
        },
      },
    };
  }
}

export class AtomPrimaryButtonStyles extends ResponsiveStyleSheet<
  ButtonStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
    layout: Layout,
  ): ButtonStyles {
    return _.merge(
      {},
      fullRoundedButtonStyles.baseStyles(
        scaleByFactor,
        scaleByBreakpoints,
        layout,
        {
          kind: 'solid',
          size: ButtonSize.X_LARGE,
          backgroundColor: config.atom.primaryColor,
          textColor: config.atom.textColor,
        },
      ),
      {
        buttonStyle: {
          marginVertical: scaleByFactor(9),
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 0.5 },
          shadowRadius: 0.8,
          shadowOpacity: 0.2,
        },
        textStyle: {
          fontFamily: 'JosefinSans-Bold',
          fontSize: scaleByFactor(24),
          marginTop: scaleByFactor(5),
        },
      },
    );
  }

  public lightStyles(): Partial<ButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<ButtonStyles> {
    return {};
  }
}

export class AtomSecondaryButtonStyles extends ResponsiveStyleSheet<
  ButtonStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
    layout: Layout,
  ): ButtonStyles {
    return _.merge(
      {},
      fullRoundedButtonStyles.baseStyles(
        scaleByFactor,
        scaleByBreakpoints,
        layout,
        {
          kind: 'solid',
          size: ButtonSize.LARGE,
          backgroundColor: config.atom.secondaryColor,
          textColor: config.atom.textColor,
        },
      ),
      {
        buttonStyle: {
          marginHorizontal: scaleByFactor(16),
          marginVertical: scaleByFactor(9),
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 0.5 },
          shadowRadius: 0.8,
          shadowOpacity: 0.2,
        },
        textStyle: {
          fontFamily: 'JosefinSans-Bold',
          fontSize: scaleByFactor(20),
          marginTop: scaleByFactor(5),
        },
      },
    );
  }

  public lightStyles(): Partial<ButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<ButtonStyles> {
    return {};
  }
}

export interface AtomLightBoxButtonOptions {
  backgroundColor: string;
  textColor: string;
}

export class AtomLightBoxButtonStyles extends ResponsiveStyleSheet<
  ButtonStyles,
  AtomLightBoxButtonOptions
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
    layout: Layout,
    options: AtomLightBoxButtonOptions,
  ): ButtonStyles {
    return _.merge(
      {},
      fullRoundedButtonStyles.baseStyles(
        scaleByFactor,
        scaleByBreakpoints,
        layout,
        {
          kind: 'solid',
          size: ButtonSize.LARGE,
          backgroundColor: options.backgroundColor,
          textColor: options.textColor,
        },
      ),
      {
        buttonStyle: {
          flex: 1,
          marginHorizontal: scaleByFactor(8),
        },
        textStyle: {
          fontFamily: 'JosefinSans-Bold',
        },
      },
    );
  }

  public lightStyles(): Partial<ButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<ButtonStyles> {
    return {};
  }

  public getLightBoxPrimaryButtonStyles(
    layout: Layout,
    theme: Theme,
  ): ButtonStyles {
    return this.compile(layout, theme, {
      backgroundColor: config.atom.primaryColor,
      textColor: 'white',
    });
  }

  public getLightBoxSecondaryButtonStyles(
    layout: Layout,
    theme: Theme,
  ): ButtonStyles {
    return this.compile(layout, theme, {
      backgroundColor: '#545454',
      textColor: 'white',
    });
  }
}

export const atomStyles = new AtomStyles();
export const atomPrimaryButtonStyles = new AtomPrimaryButtonStyles();
export const atomSecondaryButtonStyles = new AtomSecondaryButtonStyles();
export const atomLightBoxButtonStyles = new AtomLightBoxButtonStyles();
