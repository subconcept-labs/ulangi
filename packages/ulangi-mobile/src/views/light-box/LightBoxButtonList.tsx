/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ButtonProps } from '@ulangi/ulangi-common/interfaces';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultButton } from '../common/DefaultButton';
import {
  LightBoxButtonListStyles,
  lightBoxButtonListResponsiveStyles,
} from './LightBoxButtonList.style';

export interface LightBoxButtonListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  buttonList: readonly ButtonProps[];
}

@observer
export class LightBoxButtonList extends React.Component<
  LightBoxButtonListProps
> {
  private get styles(): LightBoxButtonListStyles {
    return lightBoxButtonListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    if (this.props.buttonList.length === 0) {
      return null;
    } else {
      return (
        <View style={this.styles.button_list_container}>
          {this.props.buttonList.map(
            (button, index): React.ReactElement<any> => {
              return (
                <View
                  key={button.testID || index}
                  style={this.styles.button_container}>
                  <DefaultButton
                    {...button}
                    styles={
                      button.responsiveStyles
                        ? button.responsiveStyles(
                            this.props.theme,
                            this.props.screenLayout,
                          )
                        : undefined
                    }
                  />
                </View>
              );
            },
          )}
        </View>
      );
    }
  }
}
