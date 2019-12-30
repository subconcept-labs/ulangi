import { boundClass } from 'autobind-decorator';

import { config } from '../../constants/config';
import { LinkingDelegate } from '.././linking/LinkingDelegate';

@boundClass
export class OpenSourceProjectsScreenDelegate {
  private linkingDelegate: LinkingDelegate;

  public constructor(linkingDelegate: LinkingDelegate) {
    this.linkingDelegate = linkingDelegate;
  }

  public goToMainUlangiRepo(): void {
    this.linkingDelegate.openLink(config.links.githubMainRepo);
  }

  public goToTypescriptLibsRepo(): void {
    this.linkingDelegate.openLink(config.links.githubTypeScriptLibsRepo);
  }
}
