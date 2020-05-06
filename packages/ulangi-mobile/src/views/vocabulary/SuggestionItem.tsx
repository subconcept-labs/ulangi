import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSuggestion } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  SuggestionItemStyles,
  darkStyles,
  lightStyles,
} from './SuggestionItem.style';

export interface SuggestionItemProps {
  theme: Theme;
  suggestion: ObservableSuggestion;
  styles?: {
    light: SuggestionItemStyles;
    dark: SuggestionItemStyles;
  };
}

@observer
export class SuggestionItem extends React.Component<SuggestionItemProps> {
  public get styles(): SuggestionItemStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.item_container}>
        <DefaultText style={this.styles.message}>
          {this.props.suggestion.message}
        </DefaultText>
        <View style={this.styles.button_list}>
          {this.props.suggestion.buttons.map(
            (button): React.ReactElement<any> => {
              return (
                <TouchableOpacity
                  key={button.text}
                  style={this.styles.button}
                  onPress={button.onPress}>
                  <DefaultText style={this.styles.button_text}>
                    {button.text}
                  </DefaultText>
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </View>
    );
  }
}
