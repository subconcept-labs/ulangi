/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { SelectionMenu } from '@ulangi/ulangi-common/interfaces';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { LightBoxSelectionMenuIds } from '../../constants/ids/LightBoxSelectionMenuIds';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { LightBoxSelectionItem } from './LightBoxSelectionItem';
import {
  LightBoxSelectionMenuStyles,
  lightBoxSelectionMenuResponsiveStyles,
} from './LightBoxSelectionMenu.style';

export interface LightBoxSelectionMenuProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  selectionMenu: SelectionMenu<any>;
}

@observer
export class LightBoxSelectionMenu extends React.Component<
  LightBoxSelectionMenuProps
> {
  public get styles(): LightBoxSelectionMenuStyles {
    return lightBoxSelectionMenuResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View
        testID={this.props.selectionMenu.testID}
        style={this.styles.selection_menu_container}
        onStartShouldSetResponder={(): boolean => true}>
        {this.renderTopBar()}
        {this.renderContent()}
      </View>
    );
  }

  private renderTopBar(): React.ReactElement<any> {
    return (
      <View style={this.styles.light_box_top_bar}>
        <View style={[this.styles.button_container, this.styles.button_left]}>
          {this.props.selectionMenu.leftButton ? (
            <DefaultButton
              {...this.props.selectionMenu.leftButton}
              styles={
                this.props.selectionMenu.leftButton.responsiveStyles
                  ? this.props.selectionMenu.leftButton.responsiveStyles(
                      this.props.theme,
                      this.props.screenLayout,
                    )
                  : undefined
              }
            />
          ) : null}
        </View>
        <DefaultText style={this.styles.title_text}>
          {this.props.selectionMenu.title}
        </DefaultText>
        <View style={[this.styles.button_container, this.styles.button_right]}>
          {this.props.selectionMenu.rightButton ? (
            <DefaultButton
              {...this.props.selectionMenu.rightButton}
              styles={
                this.props.selectionMenu.rightButton.responsiveStyles
                  ? this.props.selectionMenu.rightButton.responsiveStyles(
                      this.props.theme,
                      this.props.screenLayout,
                    )
                  : undefined
              }
            />
          ) : null}
        </View>
      </View>
    );
  }

  private renderContent(): React.ReactElement<any> {
    return (
      <ScrollView
        testID={LightBoxSelectionMenuIds.SELECTION_LIST}
        style={this.styles.list_container}>
        {Array.from(this.props.selectionMenu.items).map(
          ([id, selectionItem], index): React.ReactElement<any> => {
            const isLast = index === this.props.selectionMenu.items.size - 1;
            return (
              <LightBoxSelectionItem
                key={selectionItem.text + '_' + index}
                screenLayout={this.props.screenLayout}
                theme={this.props.theme}
                item={selectionItem}
                isSelected={_.includes(
                  this.props.selectionMenu.selectedIds,
                  id,
                )}
                isLast={isLast}
              />
            );
          },
        )}
      </ScrollView>
    );
  }
}
