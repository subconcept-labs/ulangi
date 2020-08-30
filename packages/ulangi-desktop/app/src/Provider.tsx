/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { assertExists } from '@ulangi/assert';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import { ContainerProps } from './Container';
import { ServiceRegistry } from './ServiceRegistry';
import { ScreenContainers } from './constants/ScreenContainers';
import { config } from './constants/config';
import { extendContainer } from './decorators/extendContainer';

const muiTheme = createMuiTheme({
  palette: {
    text: {
      primary: config.styles.light.primaryTextColor,
      secondary: config.styles.light.secondaryTextColor
    },
    primary: {
      main: config.styles.primaryColor,
    },
    secondary: {
      main: config.styles.greenColor,
    },
  },
});

export interface ProviderProps {
  componentId: string;
  passedProps: object;
}

@observer
export class Provider extends React.Component<ProviderProps> {
  public render(): React.ReactElement<any> {
    const containerClass = extendContainer(
      assertExists(
        _.get(ScreenContainers, this.props.componentId),
        `Invalid componentId ${this.props.componentId}`,
      ),
    );

    const containerProps: ContainerProps<any> = {
      componentId: this.props.componentId,
      passedProps: this.props.passedProps,
      ...ServiceRegistry.services,
    };

    const themeName = ServiceRegistry.services.rootStore.themeStore.theme;

    return (
      <ThemeProvider theme={{ name: themeName }}>
        <MuiThemeProvider theme={muiTheme}>
          {React.createElement(containerClass, containerProps)}
        </MuiThemeProvider>
      </ThemeProvider>
    );
  }
}
