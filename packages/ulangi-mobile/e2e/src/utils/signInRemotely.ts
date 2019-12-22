import axios, { AxiosResponse } from 'axios';

import * as config from '../../e2e.config';

export async function signInRemotely(
  email: string,
  password: string
): Promise<AxiosResponse<any>> {
  return axios.post(config.apiUrl + '/sign-in', {
    email,
    password,
  });
}
