import Axios from 'axios';

import { resolveEnv } from '../utils/resolveEnv';

describe('API endpoint /request-password-reset', (): void => {
  const env = resolveEnv()
  it('should request password reset successfully', async (): Promise<void> => {
    const response = await Axios.post(
      env.API_URL + '/request-password-reset',
      {
        email: 'test@ulangi.com',
      }
    );

    expect(response.data.success).toBe(true);
  });
});
