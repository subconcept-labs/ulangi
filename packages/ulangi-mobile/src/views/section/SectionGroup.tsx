/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  SectionGroupStyles,
  darkStyles,
  lightStyles,
} from './SectionGroup.style';

export interface SectionGroupProps {
  theme: Theme;
  header?: string;
  children?: React.ReactNode;
  styles?: {
    light: SectionGroupStyles;
    dark: SectionGroupStyles;
  };
}

export class SectionGroup extends React.Component<SectionGroupProps> {
  public get styles(): SectionGroupStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.section_container}>
        {typeof this.props.header !== 'undefined' ? (
          <DefaultText style={this.styles.header}>
            {this.props.header}
          </DefaultText>
        ) : null}
        <View style={this.styles.item_container}>{this.props.children}</View>
      </View>
    );
  }
}
