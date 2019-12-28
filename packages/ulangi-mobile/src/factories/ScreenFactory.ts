/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { EventBus } from '@ulangi/ulangi-event';
import { Observer } from '@ulangi/ulangi-observable';

import { ContainerProps } from '../Container';
import { DialogDelegate } from '../delegates/dialog/DialogDelegate';
import { LinkingDelegate } from '../delegates/linking/LinkingDelegate';
import { NavigatorDelegate } from '../delegates/navigator/NavigatorDelegate';
import { RootScreenDelegate } from '../delegates/root/RootScreenDelegate';

export class ScreenFactory {
  protected props: ContainerProps;
  protected eventBus: EventBus;
  protected observer: Observer;

  public constructor(
    props: ContainerProps,
    eventBus: EventBus,
    observer: Observer,
  ) {
    this.props = props;
    this.eventBus = eventBus;
    this.observer = observer;
  }

  public createRootScreenDelegate(): RootScreenDelegate {
    return new RootScreenDelegate(this.props.rootStore.darkModeStore);
  }

  public createNavigatorDelegate(): NavigatorDelegate {
    return new NavigatorDelegate(
      this.observer,
      this.props.componentId,
      this.props.observableLightBox,
      this.props.rootStore.darkModeStore,
    );
  }

  public createDialogDelegate(styles: {
    light: Options;
    dark: Options;
  }): DialogDelegate {
    return new DialogDelegate(this.createNavigatorDelegate(), styles);
  }

  public createLinkingDelegate(styles: {
    light: Options;
    dark: Options;
  }): LinkingDelegate {
    return new LinkingDelegate(this.createDialogDelegate(styles));
  }
}
