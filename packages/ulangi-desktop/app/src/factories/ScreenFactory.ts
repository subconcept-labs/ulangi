import { EventBus } from '@ulangi/ulangi-event';
import { Observer } from '@ulangi/ulangi-observable';

import { ContainerProps } from '../Container';
import { DialogDelegate } from '../delegates/dialog/DialogDelegate';
import { NavigatorDelegate } from '../delegates/navigator/NavigatorDelegate';
import { SelectionMenuDelegate } from "../delegates/selection-menu/SelectionMenuDelegate"

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

  public createNavigatorDelegate(): NavigatorDelegate {
    return new NavigatorDelegate(
      this.props.rootNavigation,
      this.props.observableLightBox,
    );
  }

  public createDialogDelegate(): DialogDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new DialogDelegate(this.props.observableLightBox, navigatorDelegate);
  }

  public createSelectionMenuDelegate(): SelectionMenuDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new SelectionMenuDelegate(
      this.props.observableLightBox, 
      navigatorDelegate
    );
  }
}
