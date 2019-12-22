import axios, { AxiosResponse } from 'axios';

import * as config from '../../e2e.config';

export async function signUpRemotely(
  email: string,
  password: string
): Promise<AxiosResponse<any>> {
  return axios.post(config.apiUrl + '/sign-up', {
    email,
    password,
  });
}
