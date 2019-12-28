import { OpenSourceProjectsScreenDelegate } from '../../delegates/open-source/OpenSourceProjectsScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class OpenSourceProjectsScreenFactory extends ScreenFactory {
  public createScreenDelegate(): OpenSourceProjectsScreenDelegate {
    const linkingDelegate = this.createLinkingDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    return new OpenSourceProjectsScreenDelegate(linkingDelegate);
  }
}
