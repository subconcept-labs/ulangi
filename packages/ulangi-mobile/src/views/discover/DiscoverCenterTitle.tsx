/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  DiscoverCenterTitleStyles,
  discoverCenterTitleResponsiveStyles,
} from './DiscoverCenterTitle.style';

export interface DiscoverCenterTitleProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  setStore: ObservableSetStore;
  publicSetCount: IObservableValue<null | number>;
  search: (term: string) => void;
}

@observer
export class DiscoverCenterTitle extends React.Component<
  DiscoverCenterTitleProps
> {
  private get styles(): DiscoverCenterTitleStyles {
    return discoverCenterTitleResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.title}>
          You can search dictionary for words or categories, such as
          <DefaultText
            style={this.styles.highlighted}
            onPress={(): void => this.props.search('cat')}>
            {' '}
            cat
          </DefaultText>{' '}
          or
          <DefaultText
            style={this.styles.highlighted}
            onPress={(): void => this.props.search('animals')}>
            {' '}
            animals
          </DefaultText>
          .
        </DefaultText>
      </View>
    );
  }
}
