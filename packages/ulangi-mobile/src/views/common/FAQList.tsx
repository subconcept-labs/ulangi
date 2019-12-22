/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  FAQListStyles,
  darkStyles,
  lightStyles,
} from '../common/FAQList.style';

export interface FAQListProps {
  theme: Theme;
  sections: {
    title: string;
    content: string | React.ReactElement<any>;
  }[];
  styles?: {
    light: FAQListStyles;
    dark: FAQListStyles;
  };
}

export class FAQList extends React.Component<FAQListProps> {
  public get styles(): FAQListStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <ScrollView contentContainerStyle={this.styles.scroll_view}>
          {this.props.sections.map(
            (section, index): React.ReactElement<any> => {
              return (
                <View key={section.title} style={this.styles.section_container}>
                  <View style={this.styles.header_container}>
                    <View style={this.styles.index_container}>
                      <DefaultText style={this.styles.index}>
                        {index + 1}
                      </DefaultText>
                    </View>
                    <View style={this.styles.title_container}>
                      <DefaultText style={this.styles.title_text}>
                        {section.title}
                      </DefaultText>
                    </View>
                  </View>
                  <View style={this.styles.content_container}>
                    <DefaultText style={this.styles.content_text}>
                      {section.content}
                    </DefaultText>
                  </View>
                </View>
              );
            }
          )}
        </ScrollView>
      </View>
    );
  }
}
