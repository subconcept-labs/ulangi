import { boundClass } from 'autobind-decorator';

import { LinkingDelegate } from '.././linking/LinkingDelegate';

@boundClass
export class OpenSourceProjectsScreenDelegate {
  private linkingDelegate: LinkingDelegate;

  public constructor(linkingDelegate: LinkingDelegate) {
    this.linkingDelegate = linkingDelegate;
  }

  public openLink(link: string): void {
    this.linkingDelegate.openLink(link);
  }
}
