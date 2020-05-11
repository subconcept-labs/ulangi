import { Theme } from '@ulangi/ulangi-common/enums';
import { Attribution } from '@ulangi/ulangi-common/interfaces';
import { ObservableSuggestion } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { SuggestionItem } from './SuggestionItem';
import {
  SuggestionListStyles,
  darkStyles,
  lightStyles,
} from './SuggestionList.style';

export interface SuggestionListProps {
  theme: Theme;
  term: string;
  label: undefined | string;
  attributions: undefined | Attribution[];
  suggestions: ObservableSuggestion[];
  openLink: (link: string) => void;
  styles?: {
    light: SuggestionListStyles;
    dark: SuggestionListStyles;
  };
}

@observer
export class SuggestionList extends React.Component<SuggestionListProps> {
  public get styles(): SuggestionListStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <React.Fragment>
        {this.renderListHeader()}
        {this.props.suggestions.map(
          (suggestion, index): React.ReactElement<any> => {
            return (
              <SuggestionItem
                key={index}
                theme={this.props.theme}
                suggestion={suggestion}
              />
            );
          },
        )}
      </React.Fragment>
    );
  }

  private renderListHeader(): React.ReactElement<any> {
    return (
      <View style={this.styles.title_container}>
        <DefaultText style={this.styles.title}>
          <DefaultText>Suggestions for </DefaultText>
          <DefaultText style={this.styles.term}>{this.props.term}</DefaultText>
          {typeof this.props.attributions !== 'undefined'
            ? this.renderAttributions(this.props.attributions)
            : null}
        </DefaultText>
      </View>
    );
  }

  private renderAttributions(
    attributions: Attribution[],
  ): React.ReactElement<any> {
    return (
      <React.Fragment>
        <DefaultText> from </DefaultText>
        {attributions.map(
          (attribution, index): React.ReactElement<any> => {
            return (
              <React.Fragment key={index}>
                {index > 0 ? <DefaultText>, </DefaultText> : null}
                <DefaultText
                  onPress={(): void => {
                    if (typeof attribution.sourceLink !== 'undefined') {
                      this.props.openLink(attribution.sourceLink);
                    }
                  }}
                  style={
                    attribution.sourceLink ? this.styles.highlighted_text : null
                  }>
                  {attribution.sourceName}
                </DefaultText>
                {typeof attribution.license !== 'undefined' ? (
                  <DefaultText style={this.styles.license_text}>
                    <DefaultText>, under </DefaultText>
                    <DefaultText
                      style={this.styles.highlighted_text}
                      onPress={(): void => {
                        if (typeof attribution.licenseLink !== 'undefined') {
                          this.props.openLink(attribution.licenseLink);
                        }
                      }}>
                      {attribution.license}
                    </DefaultText>
                  </DefaultText>
                ) : null}
              </React.Fragment>
            );
          },
        )}
      </React.Fragment>
    );
  }
}
