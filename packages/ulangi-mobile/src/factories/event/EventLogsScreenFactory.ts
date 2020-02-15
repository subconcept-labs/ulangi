import { EventLogsScreenDelegate } from '../../delegates/event/EventLogsScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class EventLogsScreenFactory extends ScreenFactory {
  public createScreenDelegate(): EventLogsScreenDelegate {
    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    return new EventLogsScreenDelegate(
      this.props.rootStore.userStore,
      this.props.rootStore.eventStore,
      dialogDelegate,
    );
  }
}
