/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableDimensions } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import AutoHeightWebView from 'react-native-autoheight-webview';

import { config } from '../../constants/config';
import {
  StrokeOrdersStyles,
  darkStyles,
  lightStyles,
} from './StrokeOrders.style';

import jsEscapeStr = require('js-string-escape');

export interface StrokeOrdersProps {
  theme: Theme;
  observableDimensions: ObservableDimensions;
  words: string[];
  styles?: {
    light: StrokeOrdersStyles;
    dark: StrokeOrdersStyles;
  };
}

@observer
export class StrokeOrders extends React.Component<StrokeOrdersProps> {
  public get styles(): StrokeOrdersStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    const injectedJavascript = this.props.words
      .map(
        (word, index): string => {
          return `
      var writer${index} = HanziWriter.create('character-target-div-${index}', '${jsEscapeStr(
            word,
          )}', {
          showCharacter: false,
          showOutline: true,
          padding: 0,
          width: 60,
          height: 60,
          delayBetweenStrokes: 500,
          outlineColor: "${this.props.theme === Theme.LIGHT ? '#ddd' : '#555'}",
          strokeColor: "${
            this.props.theme === Theme.LIGHT
              ? config.styles.light.primaryTextColor
              : config.styles.dark.primaryTextColor
          }"
      });

      document.getElementById('character-target-div-${index}').addEventListener('click', function() {
        writer${index}.animateCharacter();
      });
      `;
        },
      )
      .join('\n');

    const html = [
      ...this.props.words.map(
        (__, index): string => {
          return `
          <div id="character-target-div-${index}" style="display:inline-block;"></div>
        `;
        },
      ),
      '<script src="https://cdn.jsdelivr.net/npm/hanzi-writer@2.2/dist/hanzi-writer.min.js"></script>',
    ].join('');

    return (
      <AutoHeightWebView
        source={{ html }}
        style={[
          this.styles.webview,
          {
            width: this.props.observableDimensions.windowWidth - 16 * 2,
          },
        ]}
        customScript={injectedJavascript}
        viewportContent={'width=device-width, user-scalable=no'}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
      />
    );
  }
}
