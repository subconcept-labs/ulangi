/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ActionMenu } from '@ulangi/ulangi-common/interfaces';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { LightBoxActionItem } from './LightBoxActionItem';
import {
  LightBoxActionMenuStyles,
  lightBoxActionMenuResponsiveStyles,
} from './LightBoxActionMenu.style';

export interface LightBoxActionMenuProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  actionMenu: ActionMenu;
}

@observer
export class LightBoxActionMenu extends React.Component<
  LightBoxActionMenuProps
> {
  public get styles(): LightBoxActionMenuStyles {
    return lightBoxActionMenuResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    const listSize = this.props.actionMenu.items.length;
    return (
      <View
        testID={this.props.actionMenu.testID}
        style={this.styles.action_menu_container}
        onStartShouldSetResponder={(): boolean => true}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title_text}>
            {this.props.actionMenu.title}
          </DefaultText>
        </View>
        <ScrollView style={this.styles.list_container}>
          {this.props.actionMenu.items.map(
            (item, index): React.ReactElement<any> => {
              const isLast = index === listSize - 1;
              return (
                <LightBoxActionItem
                  key={item.text}
                  theme={this.props.theme}
                  screenLayout={this.props.screenLayout}
                  isLast={isLast}
                  item={item}
                />
              );
            },
          )}
        </ScrollView>
      </View>
    );
  }
}
