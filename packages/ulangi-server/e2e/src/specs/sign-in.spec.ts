import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signIn } from '../utils/signIn';
import { signUp } from '../utils/signUp';

describe('API endpoint /sign-in', (): void => {
  describe('Tests start after signing up', (): void => {
    let email = '';
    let password = '';

    beforeEach(
      async (): Promise<void> => {
        email = generateRandomEmail();
        password = generateRandomPassword();
        await signUp(email, password);
      }
    );

    it('should sign-in successfully and return access token', async (): Promise<
      void
    > => {
      const response = await signIn(email, password);
      expect(response.data.accessToken).toBeDefined();
    });
  });
});
