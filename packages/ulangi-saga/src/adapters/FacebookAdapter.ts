import * as _ from 'lodash';
import * as RNFacebook from 'react-native-fbsdk';

export class FacebookAdapter {
  public facebook: typeof RNFacebook;

  public constructor(facebook: typeof RNFacebook) {
    this.facebook = facebook;
  }

  // TODO: Currently, react-native-fbsdk does not have this method
  // eslint-disable-next-line
  public setAutoLogAppEventsEnabled(__: boolean): void {
    _.noop();
  }
}
