import {
  ObservableLightBox,
  ObservableScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import * as React from 'react';

import { ContainerOptions } from './interfaces/ContainerOptions';
import { Services } from './interfaces/Services';

export interface ContainerProps<T extends object = {}> extends Services {
  readonly componentId: string;
  readonly passedProps: T;
}

export abstract class Container<T extends object = {}> extends React.Component<
  ContainerProps<T>
> {
  protected readonly defaultContainerOptions: Readonly<ContainerOptions> = {
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

  public componentDidAppear(): void {
    _.noop();
  }

  public componentDidDisaappear(): void {
    _.noop();
  }
}
