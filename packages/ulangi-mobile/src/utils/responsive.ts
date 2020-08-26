import { Theme } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';
import { memoize } from 'lodash-decorators';
import { Dimensions, StyleSheet } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
export const shortDimension =
  windowWidth < windowHeight ? windowWidth : windowHeight;
export const longDimension =
  windowWidth < windowHeight ? windowHeight : windowWidth;

export interface Layout {
  width: number;
  height: number;
}

export type ScaleByFactor = (value: number, factor?: number) => number;
export type ScaleByBreakpoints = (
  values: readonly [number, number, number, number],
) => number;

export abstract class ResponsiveStyleSheet<T, O = {}> {
  private defaultFactor = 0.1;

  public abstract baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
    layout: Layout,
    options?: O,
  ): T;
  public abstract lightStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
    layout: Layout,
    options?: O,
  ): Partial<T>;
  public abstract darkStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
    layout: Layout,
    options?: O,
  ): Partial<T>;

  public compile(layout: Layout, theme: Theme, options?: O): T {
    return this.memoizedCompile(layout.width, layout.height, theme, options);
  }

  @memoize((...args: any[]): string => JSON.stringify(args))
  protected memoizedCompile(
    width: number,
    height: number,
    theme: Theme,
    options?: O,
  ): T {
    const scaleByFactor = (value: number, factor?: number): number => {
      return this.scaleByFactor(
        value,
        typeof factor !== 'undefined' ? factor : this.defaultFactor,
        width,
      );
    };

    const scaleByBreakpoints = (
      values: readonly [number, number, number, number],
    ): number => {
      return this.scaleByBreakpoints(values, width);
    };

    return StyleSheet.create(
      _.merge(
        {},
        this.baseStyles(
          scaleByFactor,
          scaleByBreakpoints,
          { width, height },
          options,
        ),
        theme === Theme.LIGHT
          ? this.lightStyles(
              scaleByFactor,
              scaleByBreakpoints,
              { width, height },
              options,
            )
          : this.darkStyles(
              scaleByFactor,
              scaleByBreakpoints,
              { width, height },
              options,
            ),
      ),
    );
  }

  protected scaleByFactor(
    value: number,
    factor: number,
    width: number,
  ): number {
    const baseWidth = 350;
    // calculation from react-native-size-matters
    return Math.round(value + ((width / baseWidth) * value - value) * factor);
  }

  // scale by breakpoints
  protected scaleByBreakpoints(
    values: readonly [number, number, number, number],
    width: number,
  ): number {
    // Portrait phones
    if (width < 576) {
      return values[0];
      // Landscape phones
    } else if (width < 768) {
      return values[1];
      // Portrait tablets
    } else if (width < 992) {
      return values[2];
      // Landscape tablets and desktops
    } else {
      return values[3];
    }
  }
}

export const defaultHorizontalMarginByBreakpoints: readonly [
  number,
  number,
  number,
  number
] = [16, 56, 106, 196];
