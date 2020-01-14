/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { Attribution } from '@ulangi/ulangi-common/interfaces';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

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
  attributions: Attribution[];
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
        <View style={this.styles.attribution_containers}>
          {this.props.attributions.map(
            (attribution): React.ReactElement<any> => {
              return this.renderAttribution(attribution);
            },
          )}
        </View>
      </View>
    );
  }

  private renderAttribution(attribution: Attribution): React.ReactElement<any> {
    return (
      <View
        key={attribution.sourceName}
        style={this.styles.attribution_container}>
        <DefaultText allowFontScaling={false} style={this.styles.attribution}>
          <DefaultText
            style={attribution.sourceLink ? this.styles.highlighted : null}
            onPress={(): void => {
              if (typeof attribution.sourceLink !== 'undefined') {
                this.props.openLink(attribution.sourceLink);
              }
            }}>
            {attribution.sourceName}
          </DefaultText>
          {typeof attribution.license !== 'undefined' ? (
            <DefaultText>
              <DefaultText> (under </DefaultText>
              <DefaultText
                onPress={(): void => {
                  if (typeof attribution.licenseLink !== 'undefined') {
                    this.props.openLink(attribution.licenseLink);
                  }
                }}
                style={
                  attribution.licenseLink ? this.styles.highlighted : null
                }>
                {attribution.license}
              </DefaultText>
              <DefaultText>)</DefaultText>
            </DefaultText>
          ) : null}
        </DefaultText>
      </View>
    );
  }
}
