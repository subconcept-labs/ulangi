import Axios, { AxiosPromise } from 'axios';

import { resolveEnv } from '../utils/resolveEnv';

export function signIn(email: string, password: string): AxiosPromise<any> {
  const env = resolveEnv()

  return Axios.post(env.API_URL + '/sign-in', {
    email,
    password,
  });
}
