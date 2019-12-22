import Axios from 'axios';
import { resolveEnv } from "../utils/resolveEnv"

describe('API endpoint /get-remote-config', (): void => {
  const env = resolveEnv();

  it('should return remote config successfully', async (): Promise<void> => {
    const response = await Axios.get(env.API_URL + '/get-remote-config');
    expect(response.data.remoteConfig).toEqual(response.data.remoteConfig);
  });
});
