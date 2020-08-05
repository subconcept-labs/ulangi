/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ReadonlyTuple } from '@ulangi/extended-types';
import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableSet,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList, ScrollView, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { SetItem } from './SetItem';
import { SetListStyles, setListResponsiveStyles } from './SetList.style';

export interface SetListProps {
  testID: string;
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  currentSetId: string;
  setList: null | Map<string, ObservableSet>;
  isRefreshing: boolean;
  refresh: () => void;
  showSetActionMenu: (set: ObservableSet) => void;
  styles?: {
    light: SetListStyles;
    dark: SetListStyles;
  };
}

@observer
export class SetList extends React.Component<SetListProps> {
  private keyExtractor = ([setId]: [string, ObservableSet]): string => setId;

  public get styles(): SetListStyles {
    return setListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    if (this.props.setList !== null && this.props.setList.size === 0) {
      return (
        <ScrollView contentContainerStyle={this.styles.empty_list_container}>
          <DefaultText style={this.styles.empty_text}>
            Oops. Nothing here!
          </DefaultText>
        </ScrollView>
      );
    } else {
      return (
        <View style={this.styles.list_container}>
          <FlatList
            testID={this.props.testID}
            contentContainerStyle={this.styles.list}
            keyExtractor={this.keyExtractor}
            data={this.props.setList ? Array.from(this.props.setList) : []}
            renderItem={({
              item,
            }: {
              item: ReadonlyTuple<string, ObservableSet>;
            }): React.ReactElement<any> => {
              return (
                <SetItem
                  theme={this.props.theme}
                  screenLayout={this.props.screenLayout}
                  currentSetId={this.props.currentSetId}
                  showSetActionMenu={this.props.showSetActionMenu}
                  setTuple={item}
                />
              );
            }}
            onRefresh={this.props.refresh}
            refreshing={this.props.isRefreshing}
          />
        </View>
      );
    }
  }
}
