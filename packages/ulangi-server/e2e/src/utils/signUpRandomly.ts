import { AxiosPromise } from 'axios';

import { generateRandomEmail } from './generateRandomEmail';
import { generateRandomPassword } from './generateRandomPassword';
import { signUp } from './signUp';

export function signUpRandomly(): AxiosPromise<any> {
  return signUp(generateRandomEmail(), generateRandomPassword());
}
