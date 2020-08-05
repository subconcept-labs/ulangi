import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableSuggestion,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  SuggestionItemStyles,
  suggestionItemResponsiveStyles,
} from './SuggestionItem.style';

export interface SuggestionItemProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  suggestion: ObservableSuggestion;
  styles?: {
    light: SuggestionItemStyles;
    dark: SuggestionItemStyles;
  };
}

@observer
export class SuggestionItem extends React.Component<SuggestionItemProps> {
  public get styles(): SuggestionItemStyles {
    return suggestionItemResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
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
