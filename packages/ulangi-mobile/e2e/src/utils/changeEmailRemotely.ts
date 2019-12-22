import axios, { AxiosResponse } from 'axios';

import * as config from '../../e2e.config.js';

export function changeEmailRemotely(
  newEmail: string,
  password: string,
  accessToken: string
): Promise<AxiosResponse<any>> {
  return axios.post(
    config.apiUrl + '/change-email',
    {
      newEmail,
      password,
    },
    { headers: { Authorization: 'Bearer ' + accessToken } }
  );
}
