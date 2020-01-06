import { ErrorCode } from '@ulangi/ulangi-common/enums';
import Axios from 'axios';

import { resolveEnv } from '../utils/resolveEnv';

describe('API endpoint /contact-admin', (): void => {
  const env = resolveEnv()
  it('should return success = true when send email feature@ulangi.com successfully', async (): Promise<
    void
  > => {
    const response = await Axios.post(env.API_URL + '/contact-admin', {
      adminEmail: 'feature@ulangi.com',
      replyToEmail: 'test@ulangi.com',
      subject: 'This is a test. Please ignore.',
      message: 'This is a test. Please ignore',
    });
    expect(response.data.success).toBe(true);
  });

  it('should return success = true when send email support@ulangi.com successfully', async (): Promise<
    void
  > => {
    const response = await Axios.post(env.API_URL + '/contact-admin', {
      adminEmail: 'support@ulangi.com',
      replyToEmail: 'test@ulangi.com',
      subject: 'This is a test. Please ignore.',
      message: 'This is a test. Please ignore',
    });
    expect(response.data.success).toBe(true);
  });

  it('should return success = true when send email bug@ulangi.com successfully', async (): Promise<
    void
  > => {
    const response = await Axios.post(env.API_URL + '/contact-admin', {
      adminEmail: 'bug@ulangi.com',
      replyToEmail: 'test@ulangi.com',
      subject: 'This is a test. Please ignore.',
      message: 'This is a test. Please ignore',
    });
    expect(response.data.success).toBe(true);
  });

  it('should return status 400 and INVALID_REQUEST when send email to invalid adminEmail', async (): Promise<
    void
  > => {
    await expect(
      Axios.post(env.API_URL + '/contact-admin', {
        adminEmail: 'invalid@yahoo.com',
        replyToEmail: 'test@ulangi.com',
        subject: 'This is a test. Please ignore.',
        message: 'This is a test. Please ignore',
      })
    ).rejects.toMatchObject({
      response: {
        status: 400,
        data: { errorCode: ErrorCode.GENERAL__INVALID_REQUEST },
      },
    });
  });
});
