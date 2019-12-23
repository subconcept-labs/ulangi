/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import {
  PublicSetDetailHeaderStyles,
  darkStyles,
  lightStyles,
} from './PublicSetDetailHeader.style';

export interface PublicSetDetailHeaderProps {
  theme: Theme;
  title: string;
  subtitle?: string;
  formattedAuthors: { formattedName: string; link?: string }[];
  openLink: (link: string) => void;
  styles?: {
    light: PublicSetDetailHeaderStyles;
    dark: PublicSetDetailHeaderStyles;
  };
}

@observer
export class PublicSetDetailHeader extends React.Component<
  PublicSetDetailHeaderProps
> {
  public get styles(): PublicSetDetailHeaderStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.title}>{this.props.title}</DefaultText>
        {typeof this.props.subtitle !== 'undefined' &&
        this.props.subtitle !== '' ? (
          <DefaultText style={this.styles.subtitle}>
            {this.props.subtitle}
          </DefaultText>
        ) : null}
        <View style={this.styles.author_containers}>
          {this.renderAuthors()}
        </View>
      </View>
    );
  }

  private renderAuthors(): React.ReactElement<any> {
    return (
      <React.Fragment>
        {this.props.formattedAuthors.map(
          ({ formattedName, link }): React.ReactElement<any> => {
            if (typeof link !== 'undefined' && link !== '') {
              return (
                <TouchableOpacity
                  key={formattedName}
                  onPress={(): void => {
                    this.props.openLink(link);
                  }}>
                  {this.renderAuthor(formattedName, link)}
                </TouchableOpacity>
              );
            } else {
              return this.renderAuthor(formattedName, link);
            }
          },
        )}
      </React.Fragment>
    );
  }

  private renderAuthor(
    formattedName: string,
    link?: string,
  ): React.ReactElement<any> {
    return (
      <View key={formattedName} style={this.styles.author_container}>
        <View style={this.styles.author_name_container}>
          <DefaultText allowFontScaling={false} style={this.styles.author}>
            {formattedName}
          </DefaultText>
        </View>
        {typeof link !== 'undefined' && link !== '' ? (
          <View style={this.styles.link_icon_container}>
            <Image
              style={this.styles.link_icon}
              source={Images.LINK_GREY_14X14}
            />
          </View>
        ) : null}
      </View>
    );
  }
}
