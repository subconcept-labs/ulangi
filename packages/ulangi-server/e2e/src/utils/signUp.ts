import Axios, { AxiosPromise } from 'axios';

import { resolveEnv } from '../utils/resolveEnv';

export function signUp(email: string, password: string): AxiosPromise<any> {
  const env = resolveEnv()

  return Axios.post(env.API_URL + '/sign-up', {
    email,
    password,
  });
}
