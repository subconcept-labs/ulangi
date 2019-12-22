/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableLightBox,
  ObservableScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import * as React from 'react';

import { ContainerOptions } from './interfaces/ContainerOptions';
import { Services } from './interfaces/Services';

export interface ContainerPassedProps {
  readonly theme: Theme;
  readonly styles?: {
    readonly light: Options;
    readonly dark: Options;
  };
}

export interface ContainerProps<T extends object = {}>
  extends ContainerPassedProps,
    Services {
  readonly componentId: string;
  readonly passedProps: T;
}

export abstract class Container<T extends object = {}> extends React.Component<
  ContainerProps<T>
> {
  // eslint-disable-next-line
  protected onThemeChanged(__: Theme): void {
    _.noop();
  }

  protected readonly defaultContainerOptions: Readonly<ContainerOptions> = {
    autoBindNavigationEvent: true,
    autoUpdateObservableScreen: true,
    autoUpdateObservableLightBox: true,
    autoUnsubscribeEventBus: true,
    autoUnsubscribeObserver: true,
  };

  protected eventBus = this.props.eventBusFactory.createBus();
  protected observer = new Observer();

  protected containerOptions?: Partial<ContainerOptions>;

  protected observableScreen?: ObservableScreen;
  protected observableLightBox?: ObservableLightBox;

  public getContainerOptions(): ContainerOptions {
    return _.merge(this.defaultContainerOptions, this.containerOptions);
  }
}
