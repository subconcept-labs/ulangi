/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableArc,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { config } from '../../constants/config';

export interface AtomArcsProps {
  screenLayout: ObservableScreenLayout;
  arcs: IObservableArray<ObservableArc>;
}

@observer
export class AtomArcs extends React.Component<AtomArcsProps> {
  public describeArc(
    fromPosition: { x: number; y: number },
    toPosition: { x: number; y: number },
    radius: number,
  ): string {
    const arc = [
      'M',
      fromPosition.x,
      fromPosition.y,
      'A',
      radius,
      radius,
      0,
      0,
      1,
      toPosition.x,
      toPosition.y,
    ].join(' ');
    return arc;
  }

  private generatePathKey(arc: ObservableArc): string {
    return [
      arc.fromPosition.x,
      arc.fromPosition.y,
      arc.toPosition.x,
      arc.toPosition.y,
      arc.radius,
    ].join(',');
  }

  public generateSvgKey(): string {
    return this.props.arcs
      .map((arc): string => this.generatePathKey(arc))
      .join('-');
  }

  public render(): React.ReactElement<any> {
    const { width, height } = this.props.screenLayout;
    return (
      <Svg
        key={this.generateSvgKey()}
        style={styles.container}
        width={width}
        height={height}>
        {this.props.arcs.map(
          (arc): React.ReactElement<any> => {
            return (
              <Path
                key={this.generatePathKey(arc)}
                d={this.describeArc(
                  arc.fromPosition,
                  arc.toPosition,
                  arc.radius,
                )}
                stroke={config.atom.primaryColor}
                strokeWidth={3}
                fill="none"
              />
            );
          },
        )}
      </Svg>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
