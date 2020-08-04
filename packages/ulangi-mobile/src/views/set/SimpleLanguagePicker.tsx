/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableLanguage } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Images } from '../../constants/Images';
import { ls, ss } from '../../utils/responsive';
import { DefaultText } from '../common/DefaultText';

export interface SimpleLanguagePickerProps {
  languages: readonly ObservableLanguage[];
  onSelect: (languageCode: string) => void;
  disabled: boolean;
}

@observer
export class SimpleLanguagePicker extends React.Component<
  SimpleLanguagePickerProps
> {
  public render(): React.ReactElement<any> {
    return (
      <ScrollView contentContainerStyle={styles.content_container}>
        {this.props.languages.map(
          (language): React.ReactElement<any> => {
            return this.renderItem(language);
          },
        )}
      </ScrollView>
    );
  }

  private renderItem(language: ObservableLanguage): React.ReactElement<any> {
    return (
      <TouchableOpacity
        key={language.languageCode}
        style={styles.item_touchable}
        onPress={(): void => this.props.onSelect(language.languageCode)}
        disabled={this.props.disabled}>
        {_.has(Images.FLAG_ICONS_BY_LANGUAGE_CODE, language.languageCode) ? (
          <Image
            style={styles.flag_icon}
            source={_.get(
              Images.FLAG_ICONS_BY_LANGUAGE_CODE,
              language.languageCode,
            )}
          />
        ) : (
          <Image
            style={styles.flag_icon}
            source={Images.FLAG_ICONS_BY_LANGUAGE_CODE.any}
          />
        )}
        <DefaultText style={styles.item_text}>{language.fullName}</DefaultText>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  content_container: {
    paddingHorizontal: ls(20),
    paddingBottom: ss(20),
  },

  item_touchable: {
    marginTop: ss(20),
    paddingHorizontal: ss(16),
    paddingVertical: ss(14),
    borderRadius: ss(4),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  flag_icon: {
    marginRight: ss(8),
  },

  item_text: {
    fontSize: ss(17),
    fontWeight: 'bold',
    color: '#777',
  },
});
