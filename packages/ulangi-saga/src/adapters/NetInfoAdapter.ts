import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export { NetInfoState };

export class NetInfoAdapter {
  private netInfo: typeof NetInfo;

  public constructor(netInfo: typeof NetInfo) {
    this.netInfo = netInfo;
  }

  public fetch(): Promise<NetInfoState> {
    return this.netInfo.fetch();
  }

  public addEventListener(
    listener: (netInfoState: NetInfoState) => void
  ): () => void {
    return this.netInfo.addEventListener(listener);
  }
}
