import { UserMembership } from '@ulangi/ulangi-common/enums';

import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signUp } from '../utils/signUp';

describe('API endpoint /sign-up', (): void => {
  it('should sign-up successfully and return access token', async (): Promise<
    void
  > => {
    const email = generateRandomEmail();
    const password = generateRandomPassword();
    const response = await signUp(email, password);
    expect(response.data.accessToken).toBeDefined();
  });

  it('signed-up users will have REGULAR membership by default', async (): Promise<
    void
  > => {
    const email = generateRandomEmail();
    const password = generateRandomPassword();
    const response = await signUp(email, password);
    expect(response.data.currentUser.membership).toEqual(
      UserMembership.REGULAR
    );
  });
});
